package com.content.demo.model;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    @ToString.Exclude 
    private String passwordHash;

    private String firstName;
    private String lastName;
    private String country;
    private String profilePictureUrl;

    @Column(length = 15)
    private String phoneNumber;

    @Column(length = 10)
    private String gender;

    private LocalDate dateOfBirth;

    @Column(updatable = false)
    private LocalDate registeredAt;

    @Column(length = 50, nullable = false)
    private String role; // Example: "ROLE_USER", "ROLE_ADMIN"

    private boolean active = true; 
     @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private boolean subscribedToNewsletter = false;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDate.now();
        if (role == null) {
            role = "ROLE_USER";
        }
    }
    @EqualsAndHashCode.Exclude
    @ToString.Exclude 
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Favorite> favorites = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Watchlist> watchlist = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<WatchHistory> watchHistory = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToOne(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Subscription subscription;
}
