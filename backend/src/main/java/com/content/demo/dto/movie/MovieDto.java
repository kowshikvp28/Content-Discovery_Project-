package com.content.demo.dto.movie;


import lombok.Data;

@Data 
public class MovieDto {

    private Long id; 
    private String title;
    private String posterUrl; 
    private Integer releaseYear; 

}
