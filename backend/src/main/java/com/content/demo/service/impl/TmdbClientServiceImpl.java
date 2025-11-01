package com.content.demo.service.impl;


import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.content.demo.dto.tmdb.TmdbMovieDetailDto;
import com.content.demo.service.TmdbClientService;

@Service
public class TmdbClientServiceImpl implements TmdbClientService {

    private static final Logger logger = LoggerFactory.getLogger(TmdbClientServiceImpl.class);

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.baseurl}") 
    private String tmdbBaseUrl;

    @Value("${tmdb.api.key}") 
    private String tmdbApiKey;

    public TmdbClientServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public Optional<TmdbMovieDetailDto> fetchMovieDetailsById(Long tmdbMovieId) {
        String url = UriComponentsBuilder.fromHttpUrl(tmdbBaseUrl + "/movie/" + tmdbMovieId)
                .queryParam("api_key", tmdbApiKey)
                .queryParam("language", "en-US")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            logger.debug("Fetching TMDB details for movie ID: {}", tmdbMovieId);
            ResponseEntity<TmdbMovieDetailDto> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, TmdbMovieDetailDto.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                logger.debug("Successfully fetched TMDB details for movie ID: {}", tmdbMovieId);
                return Optional.of(response.getBody());
            } else {
                logger.warn("Received non-OK status ({}) or empty body from TMDB for movie ID {}", response.getStatusCode(), tmdbMovieId);
                return Optional.empty();
            }
        } catch (HttpClientErrorException.NotFound ex) {
            logger.warn("Movie ID {} not found on TMDB.", tmdbMovieId);
            return Optional.empty(); // Not found is not an error in this context
        } catch (HttpClientErrorException ex) {
            logger.error("HTTP client error fetching TMDB details for movie ID {}: {} - {}", tmdbMovieId, ex.getStatusCode(), ex.getResponseBodyAsString());
            return Optional.empty();
        } catch (Exception ex) {
            logger.error("Error fetching TMDB details for movie ID " + tmdbMovieId, ex);
            return Optional.empty();
        }
    }
}
