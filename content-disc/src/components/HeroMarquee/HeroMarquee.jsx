
import React, { useState, useEffect } from 'react';
import './HeroMarquee.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { subscribeNewsletter } from '../../service/apiService'; 
import Sliders from '../Carousel/Sliders';

const featuredFilms = [
  { id: 42269, title: "The Maltese Falcon", subtitle: "A 1941 Film Noir Classic", imageUrl: "https://www.themoviedb.org/t/p/original/a1A8OcL5H58t4sZv9q1p5Yd5wLI.jpg" },
  { id: 289, title: "Casablanca", subtitle: "An Iconic 1942 Romance", imageUrl: "https://www.themoviedb.org/t/p/original/5K2nQG0sN224evcBUG3l3aA4u4G.jpg" },
  { id: 539, title: "Psycho", subtitle: "A 1960 Hitchcock Thriller", imageUrl: "https://www.themoviedb.org/t/p/original/8SoSg6gI0Y52ItyNeMI2IeAn5S6.jpg" }
];

const HeroMarqueeSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isJustSubscribed, setIsJustSubscribed] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, user, fetchProfile, isInitialized, isLoading: authLoading } = useAuth();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredFilms.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
      if (isLoggedIn && user?.email) {
          setEmail(user.email);
      } else {
          setEmail(''); 
      }
  }, [isLoggedIn, user]);

  const currentFilm = featuredFilms[currentIndex];
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (isLoggedIn && user) {
      setIsSubmitting(true);
      try {
        await subscribeNewsletter();
        console.log(`Newsletter subscription successful for ${user.email}`);
        setIsJustSubscribed(true);
        if (fetchProfile) {
             const currentToken = localStorage.getItem('authToken');
             if (currentToken) {
                 await fetchProfile(currentToken);
             } else {
                 console.warn("No token found to refresh profile after subscription.");
             }
        } else {
            console.warn("AuthContext does not provide a fetchProfile function.");
        }
      } catch (err) {
        console.error("Subscription API call failed:", err);
        setSubmitError(err.message || "Subscription failed. Please try again.");
         setTimeout(() => setSubmitError(''), 5000);
      } finally {
        setIsSubmitting(false);
      }
    }
    else {
      console.log("User not logged in, redirecting to membership.");
      navigate('/membership');
    }
  };
//   const handleSubscribe = async (e) => {
//   e.preventDefault();
//   setSubmitError('');

//   if (!isInitialized || authLoading) {
//     console.warn("Auth not initialized yet");
//     return;
//   }

//   if (!isLoggedIn || !user) {
//     console.log("User not logged in, redirecting to membership.");
//     navigate('/membership');
//     return;
//   }

//   setIsSubmitting(true);
//   try {
//     await subscribeNewsletter();
//     console.log(`Newsletter subscription successful for ${user.email}`);
//     setIsJustSubscribed(true);

//     if (fetchProfile) {
//       const token = localStorage.getItem('authToken');
//       if (token) await fetchProfile(token);
//     }
//   } catch (err) {
//     console.error("Subscription API call failed:", err);
//     setSubmitError(err.message || "Subscription failed. Please try again.");
//     setTimeout(() => setSubmitError(''), 5000);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


const showSuccessMessage = 
  (isInitialized && isLoggedIn && (isJustSubscribed || user?.subscribedToNewsletter));

  return (
    <div className="hero-marquee">
       {featuredFilms.map((film, index) => (
        <div
          key={film.id || index}
          className="hero-background-slide"
          style={{ backgroundImage: `url(${film.imageUrl})`, opacity: index === currentIndex ? 1 : 0 }}
        />
       ))}
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="subscription-panel">
          {isInitialized && !authLoading ? (
            <>
              {!showSuccessMessage ? (
                <>
                  <div className="panel-header">
                    <h2>The Director's Cut</h2>
                    <p>Join our exclusive mailing list for curated classics and behind-the-scenes stories.</p>
                  </div>
                  {submitError && <p className="error-message">{submitError}</p>}
                  <form onSubmit={handleSubscribe} className="panel-form">
                    <input
                      type="email"
                      placeholder={isLoggedIn ? 'Your Email (from profile)' : 'Enter your email address'}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      readOnly={isLoggedIn && !!user?.email}
                      disabled={isSubmitting}
                    />
                    <button type="submit" className="panel-subscribe-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Subscribing...' : (isLoggedIn ? 'Subscribe' : 'Become a Member')}
                    </button>
                  </form>
                </>
              ) : (
                <div className="panel-header submitted">
  <h2>The Director’s Circle Awaits You{user ? `, ${user.firstName || user.username}` : ''}!</h2>
  <p>
    You’ve stepped into an exclusive world of cinema excellence.  
    Expect hand-picked classics, early trailer drops, and insider stories —  
    all curated for true film enthusiasts like you.  
    <br /><br />
    Welcome to the circle. The reel never stops spinning. 🎬
  </p>
</div>

              )}
            </>
          ) : (
             <div className="panel-loading">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroMarqueeSlider;


