package com.content.demo.service.impl;

import java.time.LocalDate;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.demo.dto.user.SubscriptionDto;
import com.content.demo.dto.user.UpdateSubscriptionRequest; 
import com.content.demo.exceptions.ApiException;
import com.content.demo.exceptions.ResourceNotFoundException;
import com.content.demo.model.Subscription;
import com.content.demo.model.UserProfile;
import com.content.demo.repository.SubscriptionRepository;
import com.content.demo.repository.UserProfileRepository;
import com.content.demo.service.SubscriptionService;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionServiceImpl.class);

    private final UserProfileRepository userProfileRepository;
    private final SubscriptionRepository subscriptionRepository;

    private static final Set<String> VALID_PLAN_IDS = Set.of("cinephile_monthly", "archivist_yearly");

    public SubscriptionServiceImpl(UserProfileRepository userProfileRepository, SubscriptionRepository subscriptionRepository) {
        this.userProfileRepository = userProfileRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    @Transactional
    public SubscriptionDto updateSubscription(String userEmail, UpdateSubscriptionRequest request) { // Return DTO
        UserProfile user = userProfileRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "email", userEmail));

        String newPlanId = request.getPlanId();

        if (!VALID_PLAN_IDS.contains(newPlanId)) {
            logger.warn("Attempted subscription update with invalid plan ID: {}", newPlanId);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid Plan ID provided.");
        }
        Subscription subscription = subscriptionRepository.findById(user.getId())
                .orElse(new Subscription());

        if (newPlanId.equals(subscription.getPlanType()) && "ACTIVE".equals(subscription.getStatus())) {
             logger.info("User {} is already on plan {}. No update needed.", userEmail, newPlanId);
             return new SubscriptionDto(subscription);
        }

        logger.info("Placeholder: Payment processing simulation for user {} changing to plan {}.", userEmail, newPlanId);
        subscription.setUserId(user.getId());
        subscription.setUserProfile(user); 
        subscription.setPlanType(newPlanId);
        subscription.setStartDate(LocalDate.now());
        subscription.setStatus("ACTIVE");
        
        if ("archivist_yearly".equals(newPlanId)) {
            subscription.setExpiryDate(LocalDate.now().plusYears(1));
        } else {
            subscription.setExpiryDate(LocalDate.now().plusMonths(1));
        }

        logger.info("Updating subscription for user {} to plan {}. Expiry: {}", userEmail, newPlanId, subscription.getExpiryDate());
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        
        return new SubscriptionDto(savedSubscription);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionDto getSubscription(String userEmail) { // Return DTO
        UserProfile user = userProfileRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "email", userEmail));

        return subscriptionRepository.findById(user.getId())
                .map(SubscriptionDto::new) // Convert found Subscription to SubscriptionDto
                .orElse(null); // Return null if not found
    }
}

