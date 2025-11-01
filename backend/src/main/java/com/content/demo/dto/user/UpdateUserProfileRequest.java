package com.content.demo.dto.user;


import java.time.LocalDate;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserProfileRequest {

    

    @Size(max = 255) 
    private String firstName;

    @Size(max = 255)
    private String lastName;

    @Size(max = 255)
    private String country;

    @Size(max = 15)
    private String phoneNumber;

    @Size(max = 10)
    private String gender;

    private LocalDate dateOfBirth;
}
