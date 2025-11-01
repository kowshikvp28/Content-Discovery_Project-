import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom'; 
import './GenreDetailPage.css';
import {getMoviesByGenre, getImageUrl } from '../../service/tmdbService'

const GenreDetailPage = () => {
  const { genreId } = useParams(); 
  const location = useLocation();
  const genreName = location.state?.genreName || 'Selected Genre'; 
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async (pageToFetch) => {
      if (!genreId) {
        setError("Genre ID is missing.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const pagesToFetch = [1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17];
                const fetchPromises = pagesToFetch.map(page => 
                    getMoviesByGenre(genreId, pageToFetch)               
                  );
                const allPageResults = await Promise.all(fetchPromises);
                const allMovies = allPageResults.flatMap(data => data.results || [])

        const formattedMovies = allMovies.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterUrl: getImageUrl(movie.poster_path, 'w500'),
          year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
          bannerUrl: getImageUrl(movie.backdrop_path, 'original'),
          genre_ids: movie.genre_ids,
          synopsis: movie.overview,
        }));

        setMovies(formattedMovies);
        setTotalPages(data.total_pages || 1);
        setCurrentPage(data.page || 1);

      } catch (err) {
        console.error(`Error fetching movies for genre ${genreId}:`, err);
        setError(err.message || `Failed to load movies for ${genreName}.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies(currentPage);
  }, [genreId, genreName, currentPage]);

  // Pagination Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };


  return (
    <div className="genre-detail-page">
      <header className="genre-detail-header">
        <h1 className="genre-detail-title">{genreName} Films</h1>
      </header>

      {isLoading && <div className="loading-state">Loading movies...</div>}
      {error && <div className="error-state">{error}</div>}

      {!isLoading && !error && movies.length > 0 && (
        <>
          <main className="genre-movies-grid">
            {movies.map(movie => (
              <div className="movie-card-item" key={movie.id}>
                 <Link to={`/movie/${movie.id}`} state={{ movie: movie }}>
                    <img src={movie.posterUrl} alt={movie.title} className="movie-card-img" />
                    <div className="movie-card-info">
                      <h3>{movie.title}</h3>
                      <span>{movie.year}</span>
                    </div>
                </Link>
              </div>
            ))}
          </main>
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage <= 1}>
              &laquo; Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
              Next &raquo;
            </button>
          </div>
        </>
      )}

      {!isLoading && !error && movies.length === 0 && (
        <div className="empty-state">No movies found for this genre.</div>
      )}
    </div>
  );
};

export default GenreDetailPage;
