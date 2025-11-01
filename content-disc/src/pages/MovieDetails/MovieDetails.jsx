import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetails.css';
import { getMovieDetails, getRelatedMovies, getImageUrl } from '../../service/tmdbService';
import { addFavorite, removeFavorite, addToWatchlist, removeFromWatchlist, getFavorites, getWatchlist } from '../../service/apiService'; // Assuming backend service
import { useAuth } from '../../context/AuthContext'; 


const MovieDetails = () => {
  const { movieId } = useParams(); 
  const navigate = useNavigate(); 
  const { isLoggedIn, isInitialized } = useAuth();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const cardsRef = useRef();
  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) {
        setError("Movie ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        const movieDetailsData = await getMovieDetails(movieId);
        const relatedMoviesData = await getRelatedMovies(movieId);

        setMovie(movieDetailsData);
        setRelatedMovies(relatedMoviesData.results || []);

      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError(err.message || "Failed to load movie details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  useEffect(() => {
    if (!isLoggedIn || !movieId) return;

    const checkStatus = async () => {
      try {
        const [favData, watchData] = await Promise.all([
           getFavorites(),
           getWatchlist()
        ]);
        
        setIsFavorite(favData.some(favMovie => favMovie.id === parseInt(movieId, 10)));
        setIsWatchLater(watchData.some(watchMovie => watchMovie.id === parseInt(movieId, 10)));
        
      } catch (err) {
        console.warn("Could not fetch user list statuses:", err);
        setIsFavorite(false);
        setIsWatchLater(false);
      }
    };
    checkStatus();
  }, [movieId, isLoggedIn]);


  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Please log in to add favorites.");
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
      alert(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites.`);
    }
  };

  const handleToggleWatchLater = async () => {
     if (!isLoggedIn) {
      alert("Please log in to add to watchlist.");
       navigate('/login');
      return;
    }
    try {
      if (isWatchLater) {
        await removeFromWatchlist(movieId);
      } else {
        await addToWatchlist(movieId);
      }
      setIsWatchLater(!isWatchLater);
    } catch (err) {
      console.error("Error updating watchlist:", err);
      alert(`Failed to ${isWatchLater ? 'remove from' : 'add to'} watchlist.`);
    }
  };

  const getBannerUrl = (path) => path ? getImageUrl(path, 'original') : 'https://placehold.co/1400x500/181B1F/D4C29A?text=No+Banner';
  const getPosterUrl = (path) => path ? getImageUrl(path, 'w500') : 'https://placehold.co/200x300/23282E/D4C29A?text=No+Poster';
  const formatDuration = (runtime) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };
  const getYear = (releaseDate) => releaseDate ? releaseDate.substring(0, 4) : 'N/A';

  if (isLoading) {
    return <div className="loading-state">Loading movie details...</div>; 
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>; 
  }

  if (!movie) {
    return <div className="error-state">Movie not found.</div>;
  }

  const cast = movie.credits?.cast?.slice(0, 8) || []; // Limit cast display

  return (
    <div className="movie-detail-page">
      <div className="banner-section">
        <img className="banner-image" src={getBannerUrl(movie.backdrop_path)} alt={movie.title} />
        <div className="overlay-gradient" />
        <div className="movie-title-info">
          <h1>{movie.title}</h1>
          <p>
            {getYear(movie.release_date)} • {movie.genres?.map(g => g.name).join(', ') || 'N/A'} • {formatDuration(movie.runtime)} • {movie.spoken_languages?.map(l => l.english_name).join(', ') || ''}
          </p>
          <div className="action-buttons-container">
            <button className="watch-btn" onClick={() => navigate(`/player/${movie.id}`)}>▶ Watch Now</button>
            <button
              className={`icon-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleToggleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button
              className={`icon-btn ${isWatchLater ? 'active' : ''}`}
              onClick={handleToggleWatchLater}
              title={isWatchLater ? "Remove from Watchlist" : "Add to Watchlist"}
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg> 
            </button>
          </div>
        </div>
      </div>
      <div className="details-content">
        <h2>Synopsis</h2>
        <p className="synopsis-text">{movie.overview || 'No synopsis available.'}</p>

        <h3>Cast</h3>
        {cast.length > 0 ? (
          <ul className="cast-list">
            {cast.map((actor) => (
              <li key={actor.cast_id || actor.id}>{actor.name}</li>
            ))}
          </ul>
        ) : <p>Cast information not available.</p>}
        {relatedMovies.length > 0 && (
          <div className="related-movies-section">
            <h3>Related Movies</h3>
            <div className="related-movies-list">
              {relatedMovies.slice(0, 9).map((relatedMovie) => (
                <div
                  className="related-movie-card"
                  key={relatedMovie.id}
                  onClick={() => navigate(`/movie/${relatedMovie.id}`)}
                  title={relatedMovie.title}
                >
                  <img src={getPosterUrl(relatedMovie.poster_path)} alt={relatedMovie.title} />
                  <p>{relatedMovie.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
