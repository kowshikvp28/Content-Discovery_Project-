package com.content.demo.service;


import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.content.demo.dto.movie.MovieDetailDto;
import com.content.demo.dto.movie.MovieDto;
import com.content.demo.model.Genre;

public interface MovieService {

    Page<MovieDto> getMovies(String genre, String decade, Pageable pageable);

    MovieDetailDto getMovieById(Long id);

    Map<String, List<MovieDto>> getHomePageContent();

    List<Genre> getGenres(); // Or List<GenreDto>
}

