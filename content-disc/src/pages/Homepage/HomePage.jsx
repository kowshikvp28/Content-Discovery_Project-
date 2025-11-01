import React from 'react';
import './HomePage.css';

import Navigation from '../../components/Navigation/Navigation';
import Card1 from '../../components/Cards/Card1';
import HeroMarqueeSlider from '../../components/HeroMarquee/HeroMarquee';
import Footer from '../../components/Footer/Footer';

// --- Data for the movie carousels ---
// In a real app, this would come from your API
const romanticMovies = [
  { id: 1, title: "Casablanca", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=Casablanca" },
  { id: 2, title: "Singin' in the Rain", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=Singin'+in+the+Rain" },
  { id: 3, title: "It's a Wonderful Life", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=It's+a+Wonderful+Life" },
  { id: 4, title: "Roman Holiday", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=Roman+Holiday" },
  { id: 5, title: "An Affair to Remember", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=An+Affair+to+Remember" },
];

const noirMovies = [
  { id: 1, title: "The Maltese Falcon", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=The+Maltese+Falcon" },
  { id: 2, title: "Sunset Boulevard", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=Sunset+Boulevard" },
  { id: 3, title: "Double Indemnity", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=Double+Indemnity" },
  { id: 4, title: "The Big Sleep", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=The+Big+Sleep" },
  { id: 5, title: "Touch of Evil", posterUrl: "https://placehold.co/300x450/23282E/D4C29A?text=Touch+of+Evil" },
];

const HomePage = () => {
  return (
    <div className="home-page">
      <Navigation />
      <HeroMarqueeSlider/>
      
      <main className="main-content">
        <Card1/>
        <Card1/>
        {/* You can easily add more carousels here */}
      </main>
      <Footer/>
    </div>
  );
};

export default HomePage;
