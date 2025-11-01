import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCurrentUserProfile } from '../service/apiService'; 

const AuthContext = createContext({
    token: null,
    user: null,
    isLoggedIn: false,
    isLoading: true,
    isInitialized: false,
    login: (newToken) => {},
    logout: () => {},
    fetchProfile: async (token) => {},
});

const getStoredToken = () => {
    try {
        return localStorage.getItem('authToken');
    } catch (e) {
        console.error("Could not access localStorage:", e);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getStoredToken());
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const logout = useCallback(() => {
        console.log("AuthContext: Logging out");
        try {
            localStorage.removeItem('authToken');
        } catch (e) { console.error("Could not remove token from localStorage:", e); }
        setToken(null);
        setUser(null);
        setIsInitialized(true);
    }, []);

    const fetchUserProfile = useCallback(async (currentToken) => {
        console.log("AuthContext: Attempting to fetch profile with token:", !!currentToken);
        if (!currentToken) {
            setUser(null);
            setIsLoading(false);
            setIsInitialized(true);
            return;
        }
        setIsLoading(true);
        try {
            const profileData = await getCurrentUserProfile(); 
            console.log("AuthContext: Profile fetched successfully:", profileData);
            setUser(profileData);
        } catch (error) {
            console.error("AuthContext: Failed to fetch user profile:", error.message);
            logout(); 
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, [logout]);


    const login = useCallback((newToken) => {
        console.log("AuthContext: Logging in with new token");
        try {
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            fetchUserProfile(newToken);
        } catch (e) {
            console.error("Could not save token to localStorage:", e);
            logout();
        }
    }, [fetchUserProfile, logout]);


    useEffect(() => {
        if (!isInitialized) {
            fetchUserProfile(token);
        }
    }, [fetchUserProfile, token, isInitialized]);

    const value = {
        token,
        user,
        isLoggedIn: isInitialized && !!token && !!user,
        isLoading: isLoading,
        isInitialized: isInitialized,
        login,
        logout,
        fetchProfile: fetchUserProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

