
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api';

/**
 * Utility function to get the stored auth token from localStorage.
 * @returns {string|null} The token or null if not found.
 */
const getToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (e) {
    console.error("Error accessing localStorage:", e);
    return null;
  }
};

/**
 * Utility function to create headers for API requests.
 * Includes Content-Type and Authorization header with JWT token if it exists.
 * @param {boolean} [isFormData=false] - Set to true if sending FormData (e.g., file uploads).
 * @returns {Headers} The Headers object.
 */
const createHeaders = (isFormData = false) => {
  const headers = new Headers();
  if (!isFormData) {
    headers.append('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  return headers;
};

/**
 * Utility function to handle API responses from your backend.
 * Parses JSON response or handles empty responses (204 No Content).
 * Throws an error with backend message if response is not ok.
 * @param {Response} response - The fetch response object.
 * @returns {Promise<any>} - The JSON data or null for empty responses.
 * @throws {Error} - Throws an error with the message from the backend if available.
 */
const handleResponse = async (response) => {
  const contentLength = response.headers.get('Content-Length');
  if (response.status === 201 || response.status === 204 ) {
    return null; 
  }
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorText = await response.text(); 
      try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
      } catch (jsonError) {
          errorMessage = errorText || errorMessage;
      }
    } catch (e) {
      console.error("Could not read error response body:", e);
    }
    console.error("API Service Error:", errorMessage);
    throw new Error(errorMessage);
  }
  try {
      return await response.json();
  } catch (e) {
      console.error("Could not parse successful response as JSON:", e);
      throw new Error("Invalid JSON response from server.");
  }
};

/**
 * Core utility function to make API requests to your backend.
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login').
 * @param {object} [options={}] - Fetch options (method, body, isFormData, etc.).
 * @returns {Promise<any>} - The processed response data.
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const { isFormData, ...fetchOptions } = options; 
  const headers = createHeaders(isFormData);

  const config = {
    ...fetchOptions, 
    headers: headers,
  };

  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`); 

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error(`API request failed for endpoint ${endpoint}:`, error);
    throw error; 
  }
};

// --- Authentication ---
export const login = (email, password) => apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

export const register = (userData) => apiRequest('/auth/register', {
  method: 'POST',
  body: JSON.stringify(userData),
});

// --- User Profile ---
export const getCurrentUserProfile = () => apiRequest('/users/me');

export const updateUserProfile = (profileData) => apiRequest('/users/me', {
  method: 'PUT',
  body: JSON.stringify(profileData),
});

// --- Favorites ---
export const getFavorites = () => apiRequest('/users/me/favorites');
export const addFavorite = (movieId) => apiRequest(`/users/me/favorites/${movieId}`, { method: 'POST' });
export const removeFavorite = (movieId) => apiRequest(`/users/me/favorites/${movieId}`, { method: 'DELETE' });

// --- Watchlist ---
export const getWatchlist = () => apiRequest('/users/me/watchlist');
export const addToWatchlist = (movieId) => apiRequest(`/users/me/watchlist/${movieId}`, { method: 'POST' });
export const removeFromWatchlist = (movieId) => apiRequest(`/users/me/watchlist/${movieId}`, { method: 'DELETE' });

// --- Movies (from Backend, if needed) ---
export const getHomePageContent = () => apiRequest('/movies/home'); 
export const getBackendMovieDetails = (movieId) => apiRequest(`/movies/${movieId}`); 

// --- Genres (from Backend) ---
export const getBackendGenres = () => apiRequest('/movies/genres'); 

export const getSubscription = () => apiRequest('/users/me/subscription', {
  method: 'GET', 
});
export const updateSubscription = (planId) => apiRequest('/users/me/subscription', {
  method: 'PUT',
  body: JSON.stringify({ planId }), 
});
export const subscribeNewsletter = () => apiRequest('/users/me/subscribe', {
  method: 'POST',
});
