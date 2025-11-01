
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PEXELS_API_KEY = import.meta.env.VITE_PIXEL_API_KEY || process.env.REACT_APP_PIXEL_API_KEY;


export const TMDB_IMAGE_BASE_URL_W500 = 'https://image.tmdb.org/t/p/w500';
export const TMDB_IMAGE_BASE_URL_W780 = 'https://image.tmdb.org/t/p/w780';
export const TMDB_IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';

/**
 * Utility function to handle fetch requests to TMDB and process responses.
 * @param {string} endpoint - The TMDB API endpoint (e.g., '/movie/popular').
 * @param {object} [queryParams={}] - Optional query parameters.
 * @returns {Promise<any>} - The JSON data from the API.
 * @throws {Error} - Throws an error if the fetch fails or API returns an error.
 */
const fetchTmdb = async (endpoint, queryParams = {}) => {
  queryParams.api_key = TMDB_API_KEY;
  queryParams.language = queryParams.language || 'en-US';
  const validQueryParams = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined && value !== null)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const queryString = new URLSearchParams(validQueryParams).toString();
  const url = `${TMDB_BASE_URL}${endpoint}?${queryString}`;

  console.log(`Fetching TMDB: ${endpoint}`);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`TMDB API Error! Status: ${response.status}`);
      }
      console.error('TMDB API Error Response:', errorData);
      throw new Error(errorData.status_message || `TMDB API Error! Status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error(`Error fetching from TMDB endpoint ${endpoint}:`, error.message);
    throw error;
  }
};

// --- Service Functions ---

export const getPopularMovies = (page = 1) => fetchTmdb('/movie/popular', { page });
export const getTopRatedMovies = (page = 1) => fetchTmdb('/movie/top_rated', { page });
export const getUpcomingMovies = (page = 1) => fetchTmdb('/movie/upcoming', { page });

export const getMovieDetails = (movieId) => {
  if (!movieId) return Promise.reject(new Error("Movie ID is required"));
  return fetchTmdb(`/movie/${movieId}`, { append_to_response: 'credits,videos' });
};

export const getRelatedMovies = async (movieId, page = 1) => {
  if (!movieId) return Promise.reject(new Error("Movie ID is required"));

  const data = await fetchTmdb(`/movie/${movieId}/recommendations`, { page });
  const filteredResults = (data.results || []).filter(movie => {
    if (!movie.release_date) return false;
    const year = parseInt(movie.release_date.substring(0, 4));
    return year < 1990;
  });

  return { ...data, results: filteredResults };
};

export const getGenres = () => fetchTmdb('/genre/movie/list');

export const getMoviesByGenre = (genreId, page = 1, sortBy = 'popularity.desc') => {
  if (!genreId) return Promise.reject(new Error("Genre ID is required"));
  return fetchTmdb('/discover/movie', {
    with_genres: genreId,
    page: page,
    sort_by: sortBy,
    'release_date.lte': '1979-12-31'
  });
};

export const searchMovies = (query, page = 1) => {
  if (!query) return Promise.reject(new Error("Search query is required"));
  return fetchTmdb('/search/movie', { query, page});
};
export const getImageUrl = (path, size = 'w500') => {
    if (!path) {
        const dimensions = size === 'original' ? '1280x720' : '500x750';
        return `https://placehold.co/${dimensions}/181B1F/D4C29A?text=No+Image`;
    }
    let baseUrl = TMDB_IMAGE_BASE_URL_W500; // Default
    if (size === 'w780') baseUrl = TMDB_IMAGE_BASE_URL_W780;
    else if (size === 'original') baseUrl = TMDB_IMAGE_BASE_URL_ORIGINAL;

    return `${baseUrl}${path}`;
};

export const discoverMovies = (filters = {}) => {
  const queryParams = {
    sort_by: 'popularity.desc', 
    ...filters, 
    language: 'en-US' 
  };
  return fetchTmdb('/discover/movie', queryParams);
};










export async function getMovieVideo(query) {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );

    if (!res.ok) throw new Error("Failed to fetch Pexels video");
    const data = await res.json();
    return data.videos;
  } catch (err) {
    console.error("Pexels fetch error:", err);
    return [];
  }
}
