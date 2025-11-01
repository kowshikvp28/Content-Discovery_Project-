
package com.content.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.content.demo.dto.auth.JwtAuthResponse;
import com.content.demo.dto.auth.LoginRequest;
import com.content.demo.dto.auth.SignUpRequest;
import com.content.demo.model.UserProfile;
import com.content.demo.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for user login.
     * Takes email and password, returns a JWT token if successful.
     * @param loginRequest DTO containing email and password.
     * @return ResponseEntity containing the JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginRequest);
        return ResponseEntity.ok(jwtAuthResponse);
    }

    /**
     * Endpoint for new user registration.
     * Takes user details, creates the user, and returns the created profile.
     * @param signUpRequest DTO containing user registration details.
     * @return ResponseEntity containing the created UserProfile or an error message.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            UserProfile result = authService.register(signUpRequest);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
