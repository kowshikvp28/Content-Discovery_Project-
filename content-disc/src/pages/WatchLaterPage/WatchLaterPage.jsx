import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './WatchLaterPage.css';
import { getWatchlist, removeFromWatchlist } from '../../service/apiService'; 
import { useAuth } from '../../context/AuthContext'; 

const WatchLaterPage = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); 

  useEffect(() => {
    if (!isLoggedIn) {
      setError("Please log in to view your watchlist.");
      setIsLoading(false);
      return;
    }

    const fetchUserWatchlist = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getWatchlist(); 
        setWatchlistMovies(data || []);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        setError(err.message || "Failed to load your watchlist.");
        if (err.message.includes('401') || err.message.includes('403')) {
           setError("Authentication error. Please log in again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserWatchlist();
  }, [isLoggedIn, navigate]);

  const handleRemoveFromWatchlist = async (movieId) => {
    if (!isLoggedIn) return;
    try {
      await removeFromWatchlist(movieId); 
       setWatchlistMovies(currentMovies => currentMovies.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error("Error removing from watchlist:", err);
      setError(`Failed to remove movie ID ${movieId}. Please try again.`);
    }
  };


  if (isLoading) {
    return <div className="loading-state watchlist-loading">Loading your watchlist...</div>;
  }

   if (error) {
    return <div className="error-state watchlist-error">{error}</div>;
  }

   if (!isLoggedIn) {
     return (
        <div className="empty-watchlist"> 
            <h2>Please Log In</h2>
            <p>You need to be logged in to view your watchlist.</p>
            <button className="cta-button" onClick={() => navigate('/login')}>Login Now</button>
        </div>
     );
   }

  return (
    <div className="watch-later-page">
      <header className="watch-later-header">
        <h1 className="watch-later-title">My Watchlist</h1>
        <p className="watch-later-subtitle">
          Movies you've saved to watch later.
        </p>
      </header>

      <main>
        {watchlistMovies.length > 0 ? (
          <div className="watch-later-grid">
            {watchlistMovies.map(movie => (
              <div className="watch-later-card" key={movie.id} >
                 <Link to={`/movie/${movie.id}`}>
                    <img src={movie.posterUrl || `https://placehold.co/300x450/23282E/D4C29A?text=${encodeURIComponent(movie.title)}`} alt={movie.title} onClick={()=>{navigate(`/movie/${movie.id}`)}}/>
                <div className="card-overlay">
                  <p className="card-title">{movie.title}</p>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFromWatchlist(movie.id)
                    }}
                    title="Remove from Watchlist"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                    </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-watchlist">
            <div className="empty-icon">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
            </div>
            <h2>Your Watchlist is Empty</h2>
            <p>Add movies to your list by clicking the bookmark icon <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle'}}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg> on any movie detail page.</p>
            <button className="cta-button" onClick={() => navigate('/most-popular')}>Explore Movies</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WatchLaterPage;
