package com.content.demo.dto.tmdb;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) 
public class TmdbMovieDetailDto {
    private Long id;
    private String title;
    private String overview;
    private String poster_path; 
    private String backdrop_path; 
    private String release_date; 
    private Integer runtime; 
    private List<TmdbGenreDto> genres;
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TmdbGenreDto {
        private Integer id;
        private String name;
    }
}
