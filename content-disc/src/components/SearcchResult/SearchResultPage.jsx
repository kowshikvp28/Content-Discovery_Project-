import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './SearchResultPage.css'; 
import { searchMovies, getImageUrl } from '../../service/tmdbService';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('query');

  useEffect(() => {
    if (!query) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    const fetchAndFilterMovies = async () => {
      setIsLoading(true);
      setError(null);
      let allFilteredMovies = [];

      try {
        const pagesToFetch = [1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17];
        const fetchPromises = pagesToFetch.map(page => 
          searchMovies(query, page, null) 
        );
        const allPageResults = await Promise.all(fetchPromises);
        const allMovies = allPageResults.flatMap(data => data.results || []);
        const filteredResults = (allMovies || []).filter(movie => {
            if (!movie.release_date) return false; 
            const year = parseInt(movie.release_date.substring(0, 4));
            return year < 1980; 
        });

        const formattedMovies = filteredResults
          .filter(movie => movie.poster_path) 
          .map(movie => ({
            id: movie.id,
            title: movie.title,
            posterUrl: getImageUrl(movie.poster_path, 'w500'),
            year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
            bannerUrl: getImageUrl(movie.backdrop_path, 'original'),
            genre_ids: movie.genre_ids,
            synopsis: movie.overview,
          }));
        
        const uniqueMovies = Array.from(new Map(formattedMovies.map(m => [m.id, m])).values());

        setMovies(uniqueMovies);

      } catch (err) {
        console.error(`Error searching for "${query}":`, err);
        setError(err.message || `Failed to load search results.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterMovies();
  }, [query]); 

 

  return (
    <div className="most-popular-page search-results-page"> 
      <header className="mp-header">
        <h1 className="mp-title">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
      </header>

      {isLoading && <div className="loading-state">Searching for classics...</div>}
      {error && <div className="error-state">{error}</div>}

      {!isLoading && !error && movies.length > 0 && (
        <>
          <main className="mp-grid">
            {movies.map(movie => (
              <div className="mp-card" key={movie.id}>
                <Link to={`/movie/${movie.id}`} state={{ movie: movie }}>
                   <img
                     src={movie.posterUrl}
                     alt={movie.title || 'Movie Poster'}
                   />
                  <div className="mp-card-overlay">
                    <span className="mp-card-play-icon">▶</span>
                    <div className="mp-card-details">
                      <span className="mp-movie-title">{movie.title}</span>
                      <span className="mp-movie-year">{movie.year}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </main>
        </>
      )}

      {!isLoading && !error && movies.length === 0 && (
        <div className="empty-state">
          {query ? `No classic (pre-1980) results found for "${query}".` : "Please enter a search term."}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;

