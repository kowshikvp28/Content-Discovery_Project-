import React from 'react';
import './AboutPage.css';
import { useNavigate } from 'react-router-dom';
import Cards_data from '../../assets/assets/cards/Cards_data'
// Feature data - easy to update
const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
    ),
    title: "A Curated Collection",
    description: "Every film is hand-picked by our team of classic cinema enthusiasts, not by algorithms."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
    ),
    title: "Restored & Remastered",
    description: "We strive to provide the highest quality versions available, bringing timeless stories to modern screens."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
    ),
    title: "Exclusive Content",
    description: "Discover behind-the-scenes articles, director interviews, and trivia for a deeper appreciation of cinema."
  }
];

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className="about-page">
      {/* --- Hero Section --- */}
      <header className="about-hero">
        <h1 className="about-title">The Reel Story</h1>
        <p className="about-subtitle">Preserving the Golden Age of Cinema for the Digital Generation.</p>
      </header>

      {/* --- Our Mission Section --- */}
      <section className="mission-section">
        <div className="mission-image">
          <img src="https://imgs.search.brave.com/2L_8X2hW2BOHzAF22ivGUG7MXdHmxmKGN_Njyo9IB20/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA3LzU0Lzk1LzUy/LzM2MF9GXzc1NDk1/NTI5Nl9MT3QySWhv/cVFhNzFRak1YOXhj/U2NGakxUS04ydFJt/Wi5qcGc" alt="Vintage film camera" />
        </div>
        <div className="mission-text">
          <h2>Our Philosophy</h2>
          <p>
            In an age of endless content and fleeting trends, we believe in the enduring power of classic storytelling. Our library is more than just a collection of old films; it is a meticulously curated digital archive dedicated to the art, craft, and history of cinema. We are a sanctuary for cinephiles, a place to rediscover timeless masterpieces and unearth hidden gems.
          </p>
        </div>
      </section>

      {/* --- Founder Section --- */}
      <section className="founder-section">
        <h2>Meet the Founder</h2>
        <div className="founder-card">
          <img className="founder-photo" src="https://placehold.co/150x150/23282E/EAEAEA?text=Founder" alt="[Founder's Name]" />
          <h3 className="founder-name">KOWSHIK VP</h3>
          <p className="founder-title">Chief Curator & Cinephile</p>
          <blockquote className="founder-quote">
            "I started this platform to create the classic movie experience I always wanted: one that respects the art and connects a community of people who feel the same passion."
          </blockquote>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="features-section">
        <h2>Why We're Different</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Call to Action Section --- */}
      <section className="cta-section">
        <h2>Become Part of the Story</h2>
        <p>Join our community of classic film lovers and start exploring today.</p>
        <button className="cta-button" onClick={()=> navigate('/most-popular')}>Explore the Collection</button>
      </section>
    </div>
  );
};

export default AboutPage;
