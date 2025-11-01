import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './FavoritePage.css';
import { getFavorites, removeFavorite } from '../../service/apiService'; 
import { useAuth } from '../../context/AuthContext';

const FavoritesPage = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setError("Please log in to view your favorites.");
      setIsLoading(false);
      return;
    }

    const fetchUserFavorites = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getFavorites();
        setFavoriteMovies(data || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err.message || "Failed to load your favorite movies.");
        if (err.message.includes('401') || err.message.includes('403')) {
           setError("Authentication error. Please log in again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFavorites();
  }, [isLoggedIn, navigate]);
  const handleRemoveFavorite = async (movieId) => {
     if (!isLoggedIn) return; 
    try {
      await removeFavorite(movieId); 
       setFavoriteMovies(currentFavorites => currentFavorites.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError(`Failed to remove movie ID ${movieId}. Please try again.`);
    }
  };


  if (isLoading) {
    return <div className="loading-state favorites-loading">Loading your collection...</div>;
  }

   if (error) {
    return <div className="error-state favorites-error">{error}</div>;
  }
   if (!isLoggedIn) {
     return (
        <div className="empty-favorites">
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your private collection.</p>
            <button className="cta-button" onClick={() => navigate('/login')}>Login Now</button>
        </div>
     );
   }


  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <h1 className="favorites-title">My Private Collection</h1>
        <p className="favorites-subtitle">
          Your hand-picked selection of cinematic masterpieces.
        </p>
      </header>

      <main>
        {favoriteMovies.length > 0 ? (
          <div className="favorites-grid">
            {favoriteMovies.map(movie => (
              <div className="favorite-card" key={movie.id} > 
              <Link to={`/movie/${movie.id}`}>
                    <img onClick={() => navigate(`/movie/${movie.id}`)}src={movie.posterUrl || `https://placehold.co/300x450/23282E/D4C29A?text=${encodeURIComponent(movie.title)}`} alt={movie.title}  />
                <div className="card-overlay">
                  <p className="card-title">{movie.title}</p>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFavorite(movie.id);
                    }}
                    title="Remove from Favorites"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <h2>Your Collection is Empty</h2>
            <p>Start by exploring our films and clicking the heart icon <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> on any movie you love.</p>
            <button className="cta-button" onClick={() => navigate('/most-popular')}>Explore the Collection</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
