package com.content.demo.service.impl;


import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.demo.dto.auth.JwtAuthResponse;
import com.content.demo.dto.auth.LoginRequest;
import com.content.demo.dto.auth.SignUpRequest;
import com.content.demo.exceptions.ApiException;
import com.content.demo.model.UserProfile;
import com.content.demo.repository.UserProfileRepository;
import com.content.demo.security.jwt.JwtTokenProvider;
import com.content.demo.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserProfileRepository userProfileRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new JwtAuthResponse(token);
    }

    @Override
    @Transactional
    public UserProfile register(SignUpRequest signUpRequest) {
        if (userProfileRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Username is already taken!");
        }
        if (userProfileRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is already taken!");
        }

        UserProfile user = new UserProfile();
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(signUpRequest.getPassword())); // Encode password
        user.setCountry(signUpRequest.getCountry());
        user.setGender(signUpRequest.getGender());
        user.setDateOfBirth(signUpRequest.getDateOfBirth());

        return userProfileRepository.save(user);
    }
}
