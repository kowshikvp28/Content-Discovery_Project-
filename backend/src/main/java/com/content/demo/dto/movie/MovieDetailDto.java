package com.content.demo.dto.movie;
import java.util.List;

import lombok.Data;

@Data 
public class MovieDetailDto {

    private Long id;
    private String title;
    private String posterUrl;
    private Integer releaseYear;

    private String bannerUrl; 
    private String synopsis;
    private String duration; 
    private List<String> languages; 
    private List<String> genres; 
    private List<String> cast; 


    private List<MovieDto> relatedMovies;
}
