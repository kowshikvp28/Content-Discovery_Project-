
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MostPopular.css';
import { discoverMovies, getImageUrl, getGenres } from '../../service/tmdbService'; 

const languageOptions = [
    { name: "Language", code: null },
    { name: "English", code: "en" },
    { name: "Hindi", code: "hi" },
    { name: "Tamil", code: "ta" },
    { name: "Telugu", code: "te" },
    { name: "Marathi", code: "mr" },
    { name: "Malayalam", code: "ml" },
    { name: "Kannada", code: "kn" },
    { name: "Bengali", code: "bn" },
];

const decadeOptions = [
    { name: "Decade", startYear: null, endYear: null },
    { name: "1970s", startYear: 1970, endYear: 1979 },
    { name: "1960s", startYear: 1960, endYear: 1969 },
    { name: "1950s", startYear: 1950, endYear: 1959 },
    { name: "1940s", startYear: 1940, endYear: 1949 },
    { name: "1930s", startYear: 1930, endYear: 1939 },
];

const MostPopular = () => {
    const location = useLocation();
    const initialGenreId = location.state?.genreId || null;
    const initialGenreName = location.state?.genreName || 'Most Popular';

    const [filter, setFilter] = useState({
        language: null, 
        genre: initialGenreId,    
        decade: null,   
    });
    const [movies, setMovies] = useState([]);
    const [genreList, setGenreList] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await getGenres();
                setGenreList([{ id: null, name: "Genre" }, ...(data.genres || [])]);
                if(initialGenreId) {
                    setFilter(f => ({ ...f, genre: initialGenreId }));
                }
            } catch (err) {
                console.error("Failed to fetch genres:", err);
                setGenreList([{ id: null, name: "Genre" }]);
            }
        };
        fetchGenres();
    }, [initialGenreId]); 

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiParams = {
                    page: currentPage,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 50,
                    'release_date.lte': '1979-12-31', 
                };
                if (filter.genre) {
                    apiParams.with_genres = filter.genre;
                }
                if (filter.language) {
                    apiParams.with_original_language = filter.language;
                }
                if (filter.decade?.startYear) {
                    apiParams['primary_release_date.gte'] = `${filter.decade.startYear}-01-01`;
                    apiParams['primary_release_date.lte'] = `${filter.decade.endYear}-12-31`;
                }

                const data = await discoverMovies(apiParams);

                const formattedMovies = data.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    posterUrl: getImageUrl(movie.poster_path, 'w500'),
                    year: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
                    bannerUrl: getImageUrl(movie.backdrop_path, 'original'),
                    genre_ids: movie.genre_ids,
                    synopsis: movie.overview,
                }));

                setMovies(formattedMovies);
                setTotalPages(Math.min(data.total_pages || 1, 500));
                setCurrentPage(data.page || 1);

            } catch (err) {
                console.error("Error fetching movies:", err);
                setError(err.message || "Failed to load movies.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [filter, currentPage]); 

    const handleLanguageChange = (e) => {
        setCurrentPage(1);
        setFilter(f => ({ ...f, language: e.target.value || null }));
    };
    const handleGenreChange = (e) => {
        setCurrentPage(1); 
        setFilter(f => ({ ...f, genre: e.target.value ? parseInt(e.target.value, 10) : null }));
    };
    const handleDecadeChange = (e) => {
        setCurrentPage(1); 
        const selectedDecade = decadeOptions.find(d => d.name === e.target.value) || decadeOptions[0];
        setFilter(f => ({ ...f, decade: selectedDecade.startYear ? selectedDecade : null }));
    };

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
    const pageTitle = filter.genre ? genreList.find(g => g.id === filter.genre)?.name + " Films" : "Most Popular Classics";
    return (
        <div className="most-popular-page">
            <header className="mp-header">
                <h1 className="mp-title">{pageTitle}</h1>
                <div className="mp-select-filters">
                    <select value={filter.language || ''} onChange={handleLanguageChange}>
                        {languageOptions.map(l => <option key={l.code || 'lang-all'} value={l.code || ''}>{l.name}</option>)}
                    </select>

                    <select value={filter.genre || ''} onChange={handleGenreChange}>
                        {genreList.map(g => <option key={g.id || 'genre-all'} value={g.id || ''}>{g.name}</option>)}
                    </select>

                    <select value={filter.decade?.name || 'Decade'} onChange={handleDecadeChange}>
                        {decadeOptions.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                </div>
            </header>

            {isLoading && <div className="loading-state">Loading movies...</div>}
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

                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button onClick={handlePrevPage} disabled={isLoading || currentPage <= 1}>
                                &laquo; Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={handleNextPage} disabled={isLoading || currentPage >= totalPages}>
                                Next &raquo;
                            </button>
                        </div>
                    )}
                </>
            )}

            {!isLoading && !error && movies.length === 0 && (
                <div className="empty-state">No movies found matching your criteria.</div>
            )}
        </div>
    );
}
export default MostPopular;