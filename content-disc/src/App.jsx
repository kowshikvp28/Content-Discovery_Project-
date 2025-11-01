import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home/Home'
import MovieDetails from './pages/MovieDetails/MovieDetails'
import { Route, Routes } from 'react-router-dom'
import HeroMarquee from './components/HeroMarquee/HeroMarquee'
import HeroCollage from './components/HeroCollage/HeroCollage'
import AboutPage from './pages/About/AboutPage'
import MembershipPage from './pages/MembershipPage/MembershipPage'
import HomePage from './pages/Homepage/HomePage'
import MoviePlayer from './pages/MoviePlayer/MoviePlayer'
import AuthPage from './pages/LoginPage/AuthPage'
import RegisterPage from './pages/LoginPage/RegisterPage'
import HeroSplit from './components/HeroSplit/HeroSpilt'
import Sliders from './components/Carousel/Sliders'
import GenresPage from './pages/Genres/GenresPage'
import FavoritePage from './components/Favorites/FavoritePage'
import MostPopular from './pages/MovieContent/MostPopular'
import ServicePage from './pages/Service/ServicePage'
import GenreDetailPage from './pages/GenreDetails/GenreDetailPage'
import ProtectedRoute from './components/routes/ProtectedRoute'
import WatchLaterPage from './pages/WatchLaterPage/WatchLaterPage'
import UserProfile from './pages/UserProfile/UserProfile'
import SearchResultPage from './components/SearcchResult/SearchResultPage'
function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<AboutPage/>}/>
      <Route path='/login' element={<AuthPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route element={<ProtectedRoute/>}>
        <Route path='/player/:movieId' element={<MoviePlayer/>}/>
        <Route path='/movie/:movieId' element={<MovieDetails/>}/>
        <Route path='/favorites' element={<FavoritePage/>}/>
        <Route path='/watchlater' element={<WatchLaterPage/>}/>
        <Route path='/profile' element={<UserProfile/>}/>
        <Route path='/membership' element={<MembershipPage/>}/>
      </Route>
      <Route path='/genres' element={<GenresPage/>}/>
      <Route path='/genre/:genreId' element={<GenreDetailPage/>}/>
      <Route path='/most-popular' element={<MostPopular/>}/>
      <Route path='/homepage' element={<HomePage/>}/>
      <Route path='/service' element={<ServicePage/>}/>
      <Route path='/search' element={<SearchResultPage/>}/>
    </Routes>
    </>
  )
}
export default App
