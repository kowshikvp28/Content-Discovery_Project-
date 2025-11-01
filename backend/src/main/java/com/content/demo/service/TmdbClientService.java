package com.content.demo.service;


import java.util.Optional; 

import com.content.demo.dto.tmdb.TmdbMovieDetailDto;

public interface TmdbClientService {

    /**
     * Fetches movie details directly from the TMDB API by movie ID.
     * @param tmdbMovieId The TMDB ID of the movie.
     * @return An Optional containing the TmdbMovieDetailDto if found, otherwise empty.
     */
    Optional<TmdbMovieDetailDto> fetchMovieDetailsById(Long tmdbMovieId);

}

