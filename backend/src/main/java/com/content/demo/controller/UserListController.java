package com.content.demo.controller;

import java.util.List; // Assuming MovieDto is used for lists

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.content.demo.dto.movie.MovieDto;
import com.content.demo.service.UserListService;

@RestController
@RequestMapping("/api/users/me") 
@CrossOrigin(origins = "*")
public class UserListController {

    private final UserListService userListService;

    public UserListController(UserListService userListService) {
        this.userListService = userListService;
    }


    @GetMapping("/favorites")
    public ResponseEntity<List<MovieDto>> getFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername(); 
        List<MovieDto> favorites = userListService.getFavorites(userEmail);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/favorites/{movieId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long movieId, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        userListService.addFavorite(userEmail, movieId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long movieId, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        userListService.removeFavorite(userEmail, movieId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/watchlist")
    public ResponseEntity<List<MovieDto>> getWatchlist(@AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        List<MovieDto> watchlist = userListService.getWatchlist(userEmail);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/watchlist/{movieId}")
    public ResponseEntity<Void> addToWatchlist(@PathVariable Long movieId, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        userListService.addToWatchlist(userEmail, movieId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/watchlist/{movieId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable Long movieId, @AuthenticationPrincipal UserDetails userDetails) {
        String userEmail = userDetails.getUsername();
        userListService.removeFromWatchlist(userEmail, movieId);
        return ResponseEntity.noContent().build();
    }


}
