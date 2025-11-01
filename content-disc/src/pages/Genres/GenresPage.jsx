
import React from 'react';
import { Link } from 'react-router-dom'; 
import './GenresPage.css';

const genresData = {
  "genres": [
    { "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
  ]
};

const GenresPage = () => {
  return (
    <div className="genres-page">
      <header className="genres-header">
        <h1 className="genres-title">The Cinematic Spectrum</h1>
        <p className="genres-subtitle">
          Explore our curated collection by cinematic style and discover your next favorite classic.
        </p>
      </header>

      <main className="genres-grid">
        {genresData.genres.map(genre => (
          <Link
            key={genre.id}
            to={`/genre/${genre.id}`}
            state={{ genreName: genre.name }} 
            className="genre-card"
            style={{
              backgroundImage: `url(https://placehold.co/600x400/181B1F/D4C29A?text=${encodeURIComponent(genre.name)})`
            }}
          >
            <h3>{genre.name}</h3>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default GenresPage;
