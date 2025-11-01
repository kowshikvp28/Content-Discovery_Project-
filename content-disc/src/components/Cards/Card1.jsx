
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './card1.css';
import { discoverMovies, getImageUrl } from '../../service/tmdbService';

const MovieCarousel = ({ title, fetchUrlParams }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await discoverMovies({
          page: 1, 
          ...fetchUrlParams 
        });

        const formattedMovies = data.results.map(movie => ({
          id: movie.id,
          name: movie.title,
          img: getImageUrl(movie.poster_path, 'w500'), 
          posterUrl: getImageUrl(movie.poster_path, 'w500'),
          bannerUrl: getImageUrl(movie.backdrop_path, 'original'),
          year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
          genre_ids: movie.genre_ids,
          synopsis: movie.overview,
        }));
        setMovies(formattedMovies);

      } catch (err) {
        console.error(`Error fetching movies for "${title}":`, err);
        setError(err.message || `Failed to load ${title}.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [fetchUrlParams, title]); 


  const handleWheel = (event) => {
    if (cardsRef.current && Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };
  useEffect(() => {
    const element = cardsRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);
  if (error) {
    return <div className="carousel-error">Could not load {title}: {error}</div>;
  }

  return (
    <section className="movie-carousel-section">
      <div className='movie-carousel-background'>

      <h2 className="carousel-title">{title}</h2>
      {isLoading ? (
        <div className="carousel-loading">Loading...</div>
      ) : (
        <div className="card-list" ref={cardsRef}>
          {movies.map((item) => (
            <div className="movie-card" key={item.id}>
              <Link to={`/movie/${item.id}`} state={{ movie: item }}>
                <img src={item.img} alt={item.name} className="movie-img" />
                <div className="movie-info">
                  <h3>{item.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      </div>
    </section>
  );
};

export default MovieCarousel;
