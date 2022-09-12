import { GoogleOAuthProvider } from '@react-oauth/google';
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Login from "./components/Login";
import Logout from "./components/Logout";
import MoviesList from "./components/MoviesList";
import Movie from "./components/Movie";
import AddReview from "./components/AddReview"
import FavoritesList from "./components/FavoritesList"
import FavoritesDataService from './services/favorites';
import FavoritesListDataService from './services/favoriteslist';

import './App.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesMoviesList, setFavoritesMoviesList] = useState([]);
  const [doSaveFaves, setDoSaveFaves] = useState(false);
  const [doSaveFavesList, setDoSaveFavesList] = useState(false);

  const addFavorite = (movieId) => {
    setDoSaveFaves(true);
    setFavorites([...favorites, movieId])
  }

  const deleteFavorite = (movieId) => {
    setDoSaveFaves(true);
    setFavorites(favorites.filter(f => f !== movieId));
  }

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  const retrieveFavoriteMovies = useCallback(() => {
    FavoritesListDataService.getFavoriteMovies(user.googleId)
      .then(res => {
        setFavoritesMoviesList(res.data);
      })
      .catch(e => {
        console.log(e);
      })
  }, [user]);

  const retrieveFavorites = useCallback(() => {
    FavoritesDataService.getFavorites(user.googleId)
      .then(res => {
        if (res.data.favorites !== null) {
          setFavorites(res.data.favorites);
        }
      })
      .catch(e => {
        console.log(e);
      })
  }, [user]);

  const reorderFavorites = (sortFavorites) => {
    setFavorites(sortFavorites);
    setDoSaveFavesList(true);
  }

  const updateFavorites = useCallback(() => {
    var data = {
      _id: user.googleId,
      favorites: favorites
    }
    FavoritesDataService.updateFavorites(data)
      .then(res => {
        setDoSaveFaves(false);
        setDoSaveFavesList(false);
      })
      .catch(e => {
        console.log(e);
      })
  })

  useEffect(() => {
    if (user) {
      retrieveFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      retrieveFavoriteMovies();
    }
  }, [user, doSaveFaves]);

  useEffect(() => {
    if (user && (doSaveFaves || doSaveFavesList)) {
      updateFavorites();
    }
  }, [user, doSaveFaves, favorites, doSaveFavesList])

    return (
      <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
      <Navbar bg="primary" expand="lg" sticky="top" variant="dark" >
        <Container className="container-fluid">
          <Navbar.Brand className="brand" href="/">
            <img src="/images/movies-logo.png" alt="movies logo" className="moviesLogo" />
            MOVIE TIME
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" >
            <Nav className="ml-auto">
              <Nav.Link as={Link} to={"/movies"}>
                Movies
              </Nav.Link>
              { user &&
                <Nav.Link as={Link} to={"/favorites"}>
                  Favorites
                </Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
          { user ? (
              <Logout setUser={setUser} />
            ) : (
              <Login setUser={setUser} />
          )}
        </Container>
      </Navbar>

      <Routes>
        <Route exact path={"/"} element={
          <MoviesList
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite={ deleteFavorite }
            favorites={ favorites }
          />}
          />
        <Route exact path={"/movies"} element={
          <MoviesList
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite= { deleteFavorite }
            favorites={ favorites }
          />}
          />
        <Route exact path={"/favorites"} element={
          user ?
          <FavoritesList
            favorites={ favorites }
            doSaveFaves={ doSaveFaves }
            reorderFavorites= { reorderFavorites }
            favoritesMoviesList={ favoritesMoviesList }
          />
          :
          <MoviesList
            user={ user }
            addFavorite={ addFavorite }
            deleteFavorite= { deleteFavorite }
            favorites={ favorites }
          />}
        />
        <Route path={"/movies/:id/"} element={
          <Movie user={ user } />}
          />
        <Route path={"/movies/:id/review"} element={
          <AddReview user={ user } />}
          />
      </Routes>
      </div>
      </GoogleOAuthProvider>
    );
}

export default App;
