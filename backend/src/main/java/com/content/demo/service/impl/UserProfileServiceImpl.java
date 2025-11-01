package com.content.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.content.demo.dto.user.UpdateUserProfileRequest;
import com.content.demo.dto.user.UserProfileDto;
import com.content.demo.exceptions.ResourceNotFoundException;
import com.content.demo.model.UserProfile;
import com.content.demo.repository.UserProfileRepository;
import com.content.demo.service.UserProfileService;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getProfileByUsername(String username) {
        UserProfile userProfile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "username", username));
        return convertToDto(userProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getProfileByEmail(String email) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "email", email));
        return convertToDto(userProfile);
    }    
    @Override
    @Transactional
    public UserProfileDto updateProfile(String email, UpdateUserProfileRequest request) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "email", email));
        if (request.getFirstName() != null) userProfile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) userProfile.setLastName(request.getLastName());
        if (request.getCountry() != null) userProfile.setCountry(request.getCountry());
        if (request.getPhoneNumber() != null) userProfile.setPhoneNumber(request.getPhoneNumber());
        if (request.getGender() != null) userProfile.setGender(request.getGender());
        if (request.getDateOfBirth() != null) userProfile.setDateOfBirth(request.getDateOfBirth());

        UserProfile updatedProfile = userProfileRepository.save(userProfile);
        return convertToDto(updatedProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllProfiles() {
        return userProfileRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteProfile(Long userId) {
        UserProfile user = userProfileRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "id", userId));
        userProfileRepository.delete(user);
    }
    @Override
    @Transactional
    public void subscribeUserToNewsletter(String email) {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile", "email", email));

        if (!userProfile.isSubscribedToNewsletter()) {
            userProfile.setSubscribedToNewsletter(true);
            userProfileRepository.save(userProfile);
        } else {
        }
    }    private UserProfileDto convertToDto(UserProfile userProfile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(userProfile.getId());
        dto.setUsername(userProfile.getUsername());
        dto.setEmail(userProfile.getEmail()); 
        dto.setFirstName(userProfile.getFirstName());
        dto.setLastName(userProfile.getLastName());
        dto.setCountry(userProfile.getCountry());
        dto.setProfilePictureUrl(userProfile.getProfilePictureUrl());
        dto.setPhoneNumber(userProfile.getPhoneNumber());
        dto.setGender(userProfile.getGender());
        dto.setDateOfBirth(userProfile.getDateOfBirth());
        dto.setRegisteredAt(userProfile.getRegisteredAt());
        dto.setRole(userProfile.getRole());
        dto.setSubscribedToNewsletter(userProfile.isSubscribedToNewsletter());
        return dto;
    }
}
