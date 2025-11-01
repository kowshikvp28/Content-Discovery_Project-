package com.content.demo.service;

import com.content.demo.dto.auth.JwtAuthResponse;
import com.content.demo.dto.auth.LoginRequest;
import com.content.demo.dto.auth.SignUpRequest;
import com.content.demo.model.UserProfile;

public interface AuthService {

    JwtAuthResponse login(LoginRequest loginRequest);

    UserProfile register(SignUpRequest signUpRequest);
}

