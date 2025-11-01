import React from 'react';
import './HeroSplit.css';
import { Link } from 'react-router-dom';

const HeroSplit = () => {
  return (
    <div className="hero-split-layout">
      <div className='hero-split-layout-background'>

      <div className="hero-text-content">
        <h1 className="hero-split-title">The Director's Archive</h1>
        <p className="hero-split-description">
          Rediscover the timeless masterpieces of cinema. A curated collection of classic films from the Golden Age, restored for the modern era.
        </p>
        <Link to="/most-popular">
        <button className="hero-split-button">Explore the Collection</button>
        </Link>
      </div>
      <div className="hero-slider-content">
        <div className="hero-slider-blur"></div>
        <img
          src="https://res.cloudinary.com/upwork-cloud/image/upload/c_scale,w_1000/v1706635129/catalog/1752379674290298880/x8dypfpyhh3xdeam1svv.jpg"
          alt="Movie Posters Collage"
          className="pv-collage-img"
          />
      </div>
          </div>
    </div>
  );
};

export default HeroSplit;
