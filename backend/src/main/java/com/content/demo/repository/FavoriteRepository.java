package com.content.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.content.demo.model.Favorite;
import com.content.demo.model.UserMovieId;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UserMovieId> {

    List<Favorite> findByIdUserId(Long userId);

    Optional<Favorite> findByIdUserIdAndIdMovieId(Long userId, Long movieId);

    void deleteByIdUserIdAndIdMovieId(Long userId, Long movieId);

    boolean existsByIdUserIdAndIdMovieId(Long userId, Long movieId);
}
