import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Sliders.css';
import { discoverMovies, getImageUrl } from '../../service/tmdbService'; 
import { useState, useEffect } from 'react';

const Sliders = () => {
    const [slides, setSlides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSliderMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await discoverMovies({
                    page: 1,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 100,
                    'release_date.lte': '1979-12-31'
                });
                const sliderMovies = (data.results || [])
                    .filter(movie => movie.backdrop_path)
                    .slice(0, 7)
                    .map(movie => ({
                        id: movie.id,
                        title: movie.title,
                        imageUrl: getImageUrl(movie.backdrop_path, 'original')
                    }));
                setSlides(sliderMovies);
                console.log("Fetched slider movies:", sliderMovies);

            } catch (err) {
                console.error("Error fetching slider movies:", err);
                setError("Could not load featured movies.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSliderMovies();
    }, []);

    const settings = {
        dots: true, 
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, 
        fade: true,
        cssEase: 'linear',
        arrows: false,
        dotsClass: "slick-dots slick-thumb",
        appendDots: dots => ( 
            <div>
              <ul style={{ margin: "0px" }}> {dots} </ul>
            </div>
        ),
    };

    if (isLoading) {
        return <div className="slider-loading">Loading Featured...</div>;
    }

    if (error) {
        return <div className="slider-error">{error}</div>;
    }

    if (slides.length === 0) {
        return <div className="slider-empty">No featured movies found.</div>;
    }

    return (
        <div className='hero-slider-container'>
            <Slider {...settings}>
                {slides.map(slide => (
                    <div key={slide.id} className='hero-slide-item'>
                        <Link to={`/movie/${slide.id}`}>
                            <img src={slide.imageUrl} alt={slide.title} />
                            <div className="slide-caption">
                                <h3>{slide.title}</h3>
                           <div className="ticket-buttons">
                                <button className="ticket-btn" onClick={() => navigate(`/player/${slide.id}`)}>
                                <span className="ticket-icon">▶</span> Watch Now
                                </button>
                                <button className="ticket-btn info-btn" onClick={() => navigate(`/movie/${slide.id}`)}>
                                More Info
                                </button>
                            </div>
                            </div>
                        </Link>
                    </div>
                ))}
                 
            </Slider>
        </div>
    );
};

export default Sliders;
