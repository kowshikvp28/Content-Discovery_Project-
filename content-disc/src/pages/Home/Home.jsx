import {useEffect }                   from 'react';
import Navigation                     from '../../components/Navigation/Navigation';
import Card1                          from  '../../components/Cards/Card1';
import Footer                         from '../../components/Footer/Footer';
import HeroMarqueeSlider              from '../../components/HeroMarquee/HeroMarquee';
import './Home.css';
import HeroCollage from '../../components/HeroCollage/HeroCollage';
import HeroSplit from '../../components/HeroSplit/HeroSpilt';
import MovieCarousel from '../../components/Cards/Card1';
import Sliders from '../../components/Carousel/Sliders';
const GENRE_ROMANCE = 10749;
const GENRE_COMEDY = 35;
const GENRE_DRAMA = 18;
const Home = () => {
  const options = 
  {
      method: 'GET',
      headers:
      {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMjEyYmE3MGMzNWFhZjFkYjkxZTQ0NWRiMGE5Y2ExMSIsIm5iZiI6MTc1MDUwODU1MC42NzgwMDAyLCJzdWIiOiI2ODU2YTQwNmRkZmM4MWJjMTFhNzk1ZDMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.FdXQQ7uB8e7IWDRrX17U2aaCs_hzlQm_05CqKiijQFQ'
      }
  };
  useEffect(()=>{
    fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&release_date=1990', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
  },[])
  return (
    <div className='home'>
      <Navigation />
      <div>
        <HeroMarqueeSlider/>
      </div>
        <div>
        <HeroCollage/>
      </div>
      {/* <div style={{backgroundColor:'#181B1F',padding:'34px 0'}}>
        <Sliders/>
      </div> */}
      <div>
        <HeroSplit/>
      </div>
      <div className='cards-section'>
               <MovieCarousel
          title="Timeless Romances"
          fetchUrlParams={{
            'release_date.lte': '1979-12-31',
            with_genres: GENRE_ROMANCE,
            sort_by: 'popularity.desc'
          }}
        />

        <MovieCarousel
          title="Feel-Good Flicks"
          fetchUrlParams={{
            'release_date.lte': '1979-12-31',
            with_genres: GENRE_COMEDY,
            sort_by: 'vote_average.desc',
            'vote_count.gte': 100
          }}
        />

        <MovieCarousel
          title="The Realm of Emotions"
          fetchUrlParams={{
            'release_date.lte': '1979-12-31',
            with_genres: GENRE_DRAMA,
            sort_by: 'popularity.desc'
          }}
        />
      </div>
      <div className='footer-section'>
        <Footer/>
      </div>
    </div>
  );
};
export default Home;
