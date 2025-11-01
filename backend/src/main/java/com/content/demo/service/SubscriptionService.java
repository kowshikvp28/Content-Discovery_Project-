package com.content.demo.service;

import com.content.demo.dto.user.SubscriptionDto;
import com.content.demo.dto.user.UpdateSubscriptionRequest; 

public interface SubscriptionService {

    SubscriptionDto updateSubscription(String userEmail, UpdateSubscriptionRequest request); 
    SubscriptionDto getSubscription(String userEmail); 
}

