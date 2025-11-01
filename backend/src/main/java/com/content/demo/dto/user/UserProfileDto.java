package com.content.demo.dto.user;


import java.time.LocalDate;

import lombok.Data;

@Data 
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String country;
    private String profilePictureUrl;
    private String phoneNumber;
    private String gender;
    private LocalDate dateOfBirth;
    private LocalDate registeredAt;
    private String role;
    private boolean subscribedToNewsletter;

}
