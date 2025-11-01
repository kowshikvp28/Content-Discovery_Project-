package com.content.demo.service.impl;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.demo.dto.movie.MovieDetailDto;
import com.content.demo.dto.movie.MovieDto;
import com.content.demo.exceptions.ResourceNotFoundException;
import com.content.demo.model.Genre;
import com.content.demo.model.Movie;
import com.content.demo.repository.GenreRepository;
import com.content.demo.repository.MovieRepository;
import com.content.demo.service.MovieService;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public MovieServiceImpl(MovieRepository movieRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovieDto> getMovies(String genre, String decade, Pageable pageable) {
        Page<Movie> moviePage = movieRepository.findAll(pageable);
        return moviePage.map(this::convertToMovieDto);
    }

    @Override
    @Transactional(readOnly = true)
    public MovieDetailDto getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie", "id", id));
        return convertToMovieDetailDto(movie);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, List<MovieDto>> getHomePageContent() {
        Map<String, List<MovieDto>> homeContent = new HashMap<>();
        List<Movie> noirMovies = movieRepository.findTopNByGenre("Film Noir", PageRequest.of(0, 10));
        homeContent.put("Film Noir Classics", noirMovies.stream().map(this::convertToMovieDto).collect(Collectors.toList()));
        List<Movie> romanceMovies = movieRepository.findTopNByGenre("Romance", PageRequest.of(0, 10));
        homeContent.put("Golden Age Romance", romanceMovies.stream().map(this::convertToMovieDto).collect(Collectors.toList()));

        return homeContent;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Genre> getGenres() {
        return genreRepository.findAll();
  
    }


    private MovieDto convertToMovieDto(Movie movie) {
        MovieDto dto = new MovieDto();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setReleaseYear(movie.getReleaseYear());
        return dto;
    }

    private MovieDetailDto convertToMovieDetailDto(Movie movie) {
        MovieDetailDto detailDto = new MovieDetailDto();
        detailDto.setId(movie.getId());
        detailDto.setTitle(movie.getTitle());
        detailDto.setPosterUrl(movie.getPosterUrl());
        detailDto.setBannerUrl(movie.getBannerUrl());
        detailDto.setReleaseYear(movie.getReleaseYear());
        detailDto.setSynopsis(movie.getSynopsis());
        detailDto.setDuration(movie.getDuration());
        detailDto.setGenres(movie.getGenres().stream().map(Genre::getName).collect(Collectors.toList()));

        return detailDto;
    }

}
