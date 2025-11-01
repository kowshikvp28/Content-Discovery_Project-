package com.content.demo.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.content.demo.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.name = :genreName ORDER BY m.releaseYear DESC")
    List<Movie> findTopNByGenre(@Param("genreName") String genreName, org.springframework.data.domain.Pageable pageable);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}
