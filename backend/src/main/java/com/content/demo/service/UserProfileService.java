package com.content.demo.service;

import java.util.List;

import com.content.demo.dto.user.UpdateUserProfileRequest;
import com.content.demo.dto.user.UserProfileDto;

public interface UserProfileService {

    UserProfileDto getProfileByUsername(String username);

    UserProfileDto getProfileByEmail(String email); 

    UserProfileDto updateProfile(String email, UpdateUserProfileRequest request);

    List<UserProfileDto> getAllProfiles(); 

    void deleteProfile(Long userId); 
        void subscribeUserToNewsletter(String email);

}

