package com.content.demo.security;


import java.util.Collections;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.demo.model.UserProfile;
import com.content.demo.repository.UserProfileRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
    private final UserProfileRepository userProfileRepository;

    public CustomUserDetailsService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    @Transactional(readOnly = true) // Use read-only transaction for loading user data
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Attempting to load user by email: {}", email);
        UserProfile user = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        logger.debug("User found: {}, Role: {}", user.getEmail(), user.getRole());

        // Ensure the role is not null and provide a default if necessary (though shouldn't happen with @PrePersist)
        String role = user.getRole() != null ? user.getRole() : "ROLE_USER";
        Set<GrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority(role));

        // Use email as the username principal, password hash, and authorities
        return new User(user.getEmail(), user.getPasswordHash(), authorities);
    }
}
