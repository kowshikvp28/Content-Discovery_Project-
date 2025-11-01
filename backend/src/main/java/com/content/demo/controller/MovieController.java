package com.content.demo.controller;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.content.demo.dto.movie.MovieDetailDto;
import com.content.demo.dto.movie.MovieDto;
import com.content.demo.service.MovieService;
@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /**
     * Get a paginated list of movies, potentially filtered by genre, decade, etc.
     * Example: GET /api/movies?page=0&size=20&genre=Film%20Noir
     * @param pageable Spring Data object for pagination (page, size, sort).
     * @param genre Optional filter parameter for genre name.
     * @param decade Optional filter parameter for decade (e.g., "1950s").
     * @return ResponseEntity containing a page of MovieDto objects.
     */
    @GetMapping
    public ResponseEntity<Page<MovieDto>> getMovies(
            Pageable pageable,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String decade) {
        Page<MovieDto> movies = movieService.getMovies(genre, decade, pageable);
        return ResponseEntity.ok(movies);
    }

    /**
     * Get detailed information for a single movie by its ID.
     * @param id The ID of the movie.
     * @return ResponseEntity containing the MovieDetailDto.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MovieDetailDto> getMovieById(@PathVariable Long id) {
        MovieDetailDto movieDetail = movieService.getMovieById(id);
        return ResponseEntity.ok(movieDetail);
    }

    /**
     * Endpoint to fetch movies grouped by genre for the home page carousels.
     * @return ResponseEntity containing a map where keys are genre names
     * and values are lists of MovieDto objects.
     */
    @GetMapping("/home")
    public ResponseEntity<Map<String, List<MovieDto>>> getHomePageCarousels() {
        Map<String, List<MovieDto>> homePageData = movieService.getHomePageContent();
        return ResponseEntity.ok(homePageData);
    }

    /**
     * Endpoint to get a list of all available genres.
     * @return ResponseEntity containing a list of genre objects (or names).
     */


}
