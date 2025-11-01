package com.content.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.content.demo.model.WatchHistory;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Long> {
    List<WatchHistory> findByUserProfileIdOrderByWatchedAtDesc(Long userId);
    Optional<WatchHistory> findTopByUserProfileIdAndMovieIdOrderByWatchedAtDesc(Long userId, Long movieId);
}

