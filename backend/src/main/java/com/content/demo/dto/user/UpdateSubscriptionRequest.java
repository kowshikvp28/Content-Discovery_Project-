package com.content.demo.dto.user;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateSubscriptionRequest {

    @NotBlank(message = "Plan ID cannot be empty")
    private String planId; 
}

