import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MoviePlayer.css';
import { getMovieDetails, getRelatedMovies, getImageUrl } from '../../service/tmdbService';

const MoviePlayer = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) {
        setError("Mov ie ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const [movieDetailsData, relatedMoviesData] = await Promise.all([
          getMovieDetails(movieId), 
          getRelatedMovies(movieId)
        ]);

        setMovie(movieDetailsData);
        setRelatedMovies(relatedMoviesData.results || []);
        const trailer = movieDetailsData.videos?.results?.find(
          vid => vid.site === 'YouTube' && (vid.type === 'Trailer' || vid.type === 'Teaser')
        );
        setVideoKey(trailer?.key || null);

      } catch (err) {
        console.error("Error fetching player data:", err);
        setError(err.message || "Failed to load movie data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  const getPosterUrl = (path) => path ? getImageUrl(path, 'w500') : 'https://placehold.co/250x141/23282E/D4C29A?text=No+Poster'; // Adjusted placeholder size
  const getYear = (releaseDate) => releaseDate ? releaseDate.substring(0, 4) : 'N/A';
  if (isLoading) {
    return <div className="loading-state player-loading">Loading player...</div>;
  }

  if (error) {
    return <div className="error-state player-error">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="error-state player-error">Movie data could not be loaded.</div>;
  }

  return (
    <div className="player-page">
      <div className="player-container">
        {videoKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1`} // Added parameters
            title={movie.title + " Trailer"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="video-placeholder error">
            <p>Trailer not available.</p>
          </div>
        )}
      </div>

      <div className="player-details-content">
        <section className="player-movie-info">
          <h1 className="player-movie-title">{movie.title}</h1>
          <div className="player-movie-meta">
            <span>{getYear(movie.release_date)}</span>
            <span className="meta-divider">|</span>
            <span>{movie.genres?.map(g => g.name).join(', ') || 'N/A'}</span>
          </div>
          <p className="player-movie-synopsis">{movie.overview || 'No synopsis available.'}</p>
        </section>
        {relatedMovies.length > 0 && (
          <section className="up-next-section">
            <h2>Up Next</h2>
            <div className="up-next-list">
              {relatedMovies.slice(0, 10).map(nextMovie => ( 
                <div
                  className="up-next-card"
                  key={nextMovie.id}
                  onClick={() => navigate(`/movie/${nextMovie.id}`)} 
                  title={nextMovie.title}
                >
                  <img src={getImageUrl(nextMovie.backdrop_path || nextMovie.poster_path, 'w780')} alt={nextMovie.title} />
                  <div className="up-next-card-overlay">
                    <p>{nextMovie.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MoviePlayer;
