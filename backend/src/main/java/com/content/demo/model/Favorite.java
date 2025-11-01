package com.content.demo.model;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@Table(name = "favorites")
public class Favorite {

    @EmbeddedId
    private UserMovieId id = new UserMovieId(); 

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId") 
    @JoinColumn(name = "user_id")
    @EqualsAndHashCode.Exclude
    private UserProfile userProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("movieId") 
    @JoinColumn(name = "movie_id")
    @EqualsAndHashCode.Exclude 
    private Movie movie;

    @Column(nullable = false, updatable = false)
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}
