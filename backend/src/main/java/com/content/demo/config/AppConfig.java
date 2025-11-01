package com.content.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * Defines the password encoder bean used for hashing user passwords.
     * BCrypt is the standard and recommended choice.
     * @return PasswordEncoder instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Defines a RestTemplate bean for making HTTP requests to external APIs (like TMDB).
     * @return RestTemplate instance.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    // You can add other general beans here, e.g., ModelMapper, ObjectMapper configuration, etc.
}
