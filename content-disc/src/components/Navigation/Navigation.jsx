import React, { useState, useEffect, useRef } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { FaMicrophone, FaUserCircle } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './navigation.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {asset} from '../../assets/asset'

const Navigation = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { isLoggedIn, user, logout, isInitialized } = useAuth();
  const navigate = useNavigate();
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setShowSearch(false);
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      resetTranscript();
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  useEffect(() => {
    setSearchInput(transcript);
  }, [transcript]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !showSearch) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileRef]);

  return (
    <>
      {showSearch && <div className="dim-overlay" onClick={() => setShowSearch(false)} />}

      <nav className="navbar">
        <Link to="/" className="title-link">
          <img src={asset.logoimage} alt="Logo" className="logo" />
          <span>ClassicFilms</span>
        </Link>

        <ul className="nav-list">
          <Link to="/about"><li>About</li></Link>
          <Link to="/membership"><li>Membership</li></Link>
          <Link to="/genres"><li>Genres</li></Link>
          <Link to="/service"><li>Service</li></Link>
          {isLoggedIn && <Link to="/favorites"><li>Favorites</li></Link>}
        </ul>

        <div className="nav-right-items">
          <div className="search-container">
            <IoIosSearch
              className="search-icon"
              onClick={() => setShowSearch(!showSearch)}
              title="Search (Press '/')"
            />
            {showSearch && (
              <form className="search-bar-container" onSubmit={handleSearchSubmit}>
                <div className="inside-search-bar-container">
                  <IoIosSearch onClick={handleSearchSubmit} className="input-search-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search movies..."
                    className="search-bar"
                    value={searchInput}
                    onChange={handleInputChange}
                  />
                </div>
                {browserSupportsSpeechRecognition && (
                  <FaMicrophone
                    className={`mic-icon ${listening ? 'listening' : ''}`}
                    onClick={handleMicClick}
                    title={listening ? "Stop Listening" : "Search by Voice"}
                  />
                )}
              </form>
            )}
          </div>

          <div className="profile-section" ref={profileRef}>
            {isLoggedIn && user ? (
              <>
                <button className="profile-button" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                  {user.profilePictureUrl ? (
                    <img src={user.profilePictureUrl} alt="Profile" className="profile-avatar-img" />
                  ) : (
                    <FaUserCircle className="profile-avatar-icon" />
                  )}
                </button>
                {showProfileDropdown && (
                  <ul className="profile-dropdown">
                    <li><Link to="/profile" onClick={() => setShowProfileDropdown(false)}>My Profile</Link></li>
                    <li><Link to="/favorites" onClick={() => setShowProfileDropdown(false)}>Favorites</Link></li>
                    <li><Link to="/watchlater" onClick={() => setShowProfileDropdown(false)}>Watchlist</Link></li>
                    <li className="logout-item"><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                )}
              </>
            ) : (
              <button className="login-button" onClick={() => navigate('/login')}>
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;