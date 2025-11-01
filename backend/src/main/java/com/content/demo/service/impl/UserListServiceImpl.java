package com.content.demo.service.impl;

import java.util.List;
import java.util.Optional; 
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.demo.dto.movie.MovieDto;
import com.content.demo.dto.tmdb.TmdbMovieDetailDto; 
import com.content.demo.exceptions.ResourceNotFoundException;
import com.content.demo.model.Favorite;
import com.content.demo.model.Genre;
import com.content.demo.model.Movie;
import com.content.demo.model.UserMovieId;
import com.content.demo.model.UserProfile;
import com.content.demo.model.Watchlist;
import com.content.demo.repository.FavoriteRepository;
import com.content.demo.repository.GenreRepository;
import com.content.demo.repository.MovieRepository;
import com.content.demo.repository.UserProfileRepository;
import com.content.demo.repository.WatchlistRepository;
import com.content.demo.service.TmdbClientService;
import com.content.demo.service.UserListService;

@Service
public class UserListServiceImpl implements UserListService {

    private static final Logger logger = LoggerFactory.getLogger(UserListServiceImpl.class);

    private final UserProfileRepository userProfileRepository;
    private final MovieRepository movieRepository;
    private final FavoriteRepository favoriteRepository;
    private final WatchlistRepository watchlistRepository;
    private final GenreRepository genreRepository; 
    private final TmdbClientService tmdbClientService;

    @Value("${tmdb.api.image.baseurl}") 
    private String tmdbImageBaseUrl;

    public UserListServiceImpl(UserProfileRepository userProfileRepository,
                               MovieRepository movieRepository,
                               FavoriteRepository favoriteRepository,
                               WatchlistRepository watchlistRepository,
                               GenreRepository genreRepository, 
                               TmdbClientService tmdbClientService) { 
        this.userProfileRepository = userProfileRepository;
        this.movieRepository = movieRepository;
        this.favoriteRepository = favoriteRepository;
        this.watchlistRepository = watchlistRepository;
        this.genreRepository = genreRepository; 
        this.tmdbClientService = tmdbClientService; 
    }

    // --- Favorites ---

    @Override
    @Transactional(readOnly = true)
    public List<MovieDto> getFavorites(String userEmail) {
        UserProfile user = findUserByEmail(userEmail);
        List<Favorite> favorites = favoriteRepository.findByIdUserId(user.getId());
        return favorites.stream()
                .map(fav -> convertToMovieDto(fav.getMovie()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addFavorite(String userEmail, Long movieId) {
        UserProfile user = findUserByEmail(userEmail);

        Movie movie = findOrCreateMovie(movieId);

        UserMovieId favoriteId = new UserMovieId(user.getId(), movie.getId());

        if (favoriteRepository.existsById(favoriteId)) {
            logger.warn("Attempted to add movie ID {} which is already in favorites for user {}", movieId, userEmail);
            return;
        }

        Favorite favorite = new Favorite();
        favorite.setId(favoriteId);
        favorite.setUserProfile(user);
        favorite.setMovie(movie);
        favoriteRepository.save(favorite);
        logger.info("Added movie ID {} to favorites for user {}", movieId, userEmail);
    }

    @Override
    @Transactional
    public void removeFavorite(String userEmail, Long movieId) {
        UserProfile user = findUserByEmail(userEmail);
        UserMovieId favoriteId = new UserMovieId(user.getId(), movieId);

        if (!favoriteRepository.existsById(favoriteId)) {
            logger.warn("Attempted to remove non-existent favorite movie ID {} for user {}", movieId, userEmail);
            throw new ResourceNotFoundException("Favorite", "user/movie", user.getId() + "/" + movieId);
        }
        favoriteRepository.deleteById(favoriteId);
        logger.info("Removed movie ID {} from favorites for user {}", movieId, userEmail);
    }

    // --- Watchlist ---

    @Override
    @Transactional(readOnly = true)
    public List<MovieDto> getWatchlist(String userEmail) {
        UserProfile user = findUserByEmail(userEmail);
        List<Watchlist> watchlistItems = watchlistRepository.findByIdUserId(user.getId());
        return watchlistItems.stream()
                .map(item -> convertToMovieDto(item.getMovie()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addToWatchlist(String userEmail, Long movieId) {
        UserProfile user = findUserByEmail(userEmail);

        Movie movie = findOrCreateMovie(movieId);

        UserMovieId watchlistId = new UserMovieId(user.getId(), movie.getId());

        if (watchlistRepository.existsById(watchlistId)) {
            logger.warn("Attempted to add movie ID {} which is already in watchlist for user {}", movieId, userEmail);
            return;
        }

        Watchlist watchlistItem = new Watchlist();
        watchlistItem.setId(watchlistId);
        watchlistItem.setUserProfile(user);
        watchlistItem.setMovie(movie);
        watchlistRepository.save(watchlistItem);
        logger.info("Added movie ID {} to watchlist for user {}", movieId, userEmail);
    }

    @Override
    @Transactional
    public void removeFromWatchlist(String userEmail, Long movieId) {
        UserProfile user = findUserByEmail(userEmail);
        UserMovieId watchlistId = new UserMovieId(user.getId(), movieId);

        if (!watchlistRepository.existsById(watchlistId)) {
            logger.warn("Attempted to remove non-existent watchlist movie ID {} for user {}", movieId, userEmail);
            throw new ResourceNotFoundException("Watchlist", "user/movie", user.getId() + "/" + movieId);
        }
        watchlistRepository.deleteById(watchlistId);
        logger.info("Removed movie ID {} from watchlist for user {}", movieId, userEmail);
    }


    // --- Helper Methods ---

    private UserProfile findUserByEmail(String email) {
        return userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "email", email));
    }

    private Movie findOrCreateMovie(Long movieId) {
        Optional<Movie> existingMovieOpt = movieRepository.findById(movieId);
        if (existingMovieOpt.isPresent()) {
            return existingMovieOpt.get();
        }

        logger.info("Movie {} not found locally, fetching from TMDB...", movieId);
        TmdbMovieDetailDto tmdbDetails = tmdbClientService.fetchMovieDetailsById(movieId)
                .orElseThrow(() -> {
                    logger.error("Movie ID {} could not be found on TMDB.", movieId);
                    return new ResourceNotFoundException("Movie", "id", movieId); // Throw if TMDB fetch fails
                });

        Movie newMovie = new Movie();
        newMovie.setId(tmdbDetails.getId());
        newMovie.setTitle(tmdbDetails.getTitle());
        newMovie.setSynopsis(tmdbDetails.getOverview());
        newMovie.setPosterUrl(tmdbImageBaseUrl + tmdbDetails.getPoster_path());
        newMovie.setBannerUrl(tmdbImageBaseUrl + tmdbDetails.getBackdrop_path());
        if (tmdbDetails.getRelease_date() != null && tmdbDetails.getRelease_date().length() >= 4) {
            try {
                newMovie.setReleaseYear(Integer.parseInt(tmdbDetails.getRelease_date().substring(0, 4)));
            } catch (NumberFormatException e) {
                logger.warn("Could not parse year for movie {}: {}", movieId, tmdbDetails.getRelease_date());
            }
        }
        if (tmdbDetails.getGenres() != null) {
            Set<Genre> movieGenres = tmdbDetails.getGenres().stream()
                    .map(tmdbGenre -> genreRepository.findById(tmdbGenre.getId())) // Find existing Genre entity
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            newMovie.setGenres(movieGenres);
        }

        logger.info("Saving new movie from TMDB: {} ({})", newMovie.getTitle(), newMovie.getId());
        return movieRepository.save(newMovie);
    }
    private MovieDto convertToMovieDto(Movie movie) {
        if (movie == null) return null;
        MovieDto dto = new MovieDto();
        dto.setId(movie.getId());
        dto.setTitle(movie.getTitle());
        dto.setPosterUrl(movie.getPosterUrl());
        dto.setReleaseYear(movie.getReleaseYear());
        return dto;
    }
}

