package com.content.demo.service;


import java.util.List;

import com.content.demo.dto.movie.MovieDto;

public interface UserListService {

    List<MovieDto> getFavorites(String userEmail);
    void addFavorite(String userEmail, Long movieId);
    void removeFavorite(String userEmail, Long movieId);

    List<MovieDto> getWatchlist(String userEmail);
    void addToWatchlist(String userEmail, Long movieId);
    void removeFromWatchlist(String userEmail, Long movieId);

    
}

