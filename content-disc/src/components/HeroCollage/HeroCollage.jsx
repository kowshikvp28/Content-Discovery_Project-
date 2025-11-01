import React from 'react';
import './HeroCollage.css'; // This will be a new CSS file

const collageFilms = [
  { id: 1, title: "The Maltese Falcon", imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQSaDT6bIuBToAUP2NXXw2_bhVPpspmMqYs4_sjH3ih4-yzLCUSnSmY9S7vgeYj74eLwxM-Fw" },
  { id: 2, title: "Casablanca", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBSOpISeXskvjIi2Gm5Q0tZQs0Ipz3-BrbgM9j8UWBgSoMOHx32yT_BcaAT9mVK1TCbqcz9Q" },
  { id: 3, title: "Psycho", imageUrl: "https://media.s-bol.com/NjBWRXL65pOz/Y8gQg9/550x717.jpg" },
  { id: 4, title: "Citizen Kane", imageUrl: "https://cdn.britannica.com/50/59650-050-EEBB1C99/Orson-Welles-Citizen-Kane.jpg" },
  { id: 5, title: "Singin' in the Rain", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzTYWOZpnQO9SMFdHxO-QW4_VhjEgCkMN_PQ&s" },
];

const HeroCollage = () => {
  return (
    <div className="hero-collage-container">
      <div className='hero-college-container-background'>
        <div className="collage-grid">
          {collageFilms.map(film => (
            <div className="collage-card" key={film.id}>
              <img src={film.imageUrl} alt={film.title} />
              <div className="card-overlay">
                <h3>{film.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="collage-text">
          <h1>A Collection of Timeless Classics</h1>
        </div>
      </div>
    </div>
  );
};

export default HeroCollage;