package com.content.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.content.demo.dto.user.SubscriptionDto;
import com.content.demo.dto.user.UpdateSubscriptionRequest; 
import com.content.demo.dto.user.UpdateUserProfileRequest;
import com.content.demo.dto.user.UserProfileDto;
import com.content.demo.service.SubscriptionService;
import com.content.demo.service.UserProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final SubscriptionService subscriptionService;

    public UserProfileController(UserProfileService userProfileService, SubscriptionService subscriptionService) {
        this.userProfileService = userProfileService;
        this.subscriptionService = subscriptionService;
    }
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDto userProfile = userProfileService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userProfile);
    }
    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateCurrentUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateUserProfileRequest request) {
        String email = userDetails.getUsername();
        UserProfileDto updatedProfile = userProfileService.updateProfile(email, request);
        return ResponseEntity.ok(updatedProfile);
    }
    @GetMapping("/me/subscription")
    public ResponseEntity<?> getCurrentUserSubscription(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        SubscriptionDto subscriptionDto = subscriptionService.getSubscription(email); // 2. Call DTO method
        if (subscriptionDto == null) {
            return ResponseEntity.notFound().build(); 
        }
        return ResponseEntity.ok(subscriptionDto); 
    }

    @PutMapping("/me/subscription")
    public ResponseEntity<?> updateCurrentUserSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateSubscriptionRequest request) {
        String email = userDetails.getUsername();
        SubscriptionDto updatedSubscriptionDto = subscriptionService.updateSubscription(email, request); 
        return ResponseEntity.ok(updatedSubscriptionDto); 
    }
  @PostMapping("/me/subscribe")
public ResponseEntity<Map<String, String>> subscribeNewsletter(@AuthenticationPrincipal UserDetails userDetails) {
    String email = userDetails.getUsername();
    userProfileService.subscribeUserToNewsletter(email);

    Map<String, String> response = new HashMap<>();
    response.put("message", "Subscribed successfully!");
    return ResponseEntity.ok(response);
}
    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDto> getProfileByUsername(@PathVariable String username) {
        UserProfileDto userProfile = userProfileService.getProfileByUsername(username);
        return ResponseEntity.ok(userProfile);
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllProfiles() {
        return ResponseEntity.ok(userProfileService.getAllProfiles());
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProfile(@PathVariable Long id) {
        userProfileService.deleteProfile(id);
        return ResponseEntity.ok("User with ID " + id + " deleted successfully.");
    }
}
