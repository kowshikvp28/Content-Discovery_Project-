package com.content.demo.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.content.demo.model.UserMovieId;
import com.content.demo.model.Watchlist;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, UserMovieId> {
    List<Watchlist> findByIdUserId(Long userId);
    Optional<Watchlist> findByIdUserIdAndIdMovieId(Long userId, Long movieId);
    void deleteByIdUserIdAndIdMovieId(Long userId, Long movieId);
    boolean existsByIdUserIdAndIdMovieId(Long userId, Long movieId);
}
