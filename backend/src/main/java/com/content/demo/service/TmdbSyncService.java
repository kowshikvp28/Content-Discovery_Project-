package com.content.demo.service;

public interface TmdbSyncService {

    String syncPopularMovies(int pagesToFetch);

    String syncGenres();

    void syncMovieDetails(Long tmdbMovieId);
}

