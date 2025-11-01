package com.content.demo.dto.user;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SubscriptionDto {

    private Long userId;
    private String planType;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private String status;
    public SubscriptionDto(com.content.demo.model.Subscription entity) {
        if (entity != null) {
            this.userId = entity.getUserId();
            this.planType = entity.getPlanType();
            this.startDate = entity.getStartDate();
            this.expiryDate = entity.getExpiryDate();
            this.status = entity.getStatus();
        }
    }
}

