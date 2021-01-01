import React, { useState, useEffect } from 'react';
import Particles from 'react-particles-js';
import { Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import Spinner from './components/Spinner/Spinner';
import './App.css';

const particlesOptions = {
  // customize this to your liking
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

const initialUserData = {
  id: '',
  name: '',
  email: '',
  entries: 0,
  joined: '',
  pet: '',
  age: '',
};

const App = () => {
  const [user, setUser] = useState(initialUserData);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const signInWithToken = async () => {
      const token = window.sessionStorage.getItem('token');
      if (token) {
        setIsLoading(true);
        await handleSignIn('', '', token);
        setIsLoading(false);
      }
    };
    signInWithToken();
  }, []); // eslint-disable-line

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      pet: data.pet,
      age: data.age,
    });
  };

  const setCount = (count) => {
    setUser({ ...user, entries: count });
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      window.sessionStorage.removeItem('token');
      setUser(initialUserData);
      setIsProfileOpen(false);
      setIsSignedIn(false);
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
  };

  const toggleModal = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  };

  const handleSignIn = async (
    signInEmail = '',
    signInPassword = '',
    token = ''
  ) => {
    const signInRes = await fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: token
        ? ''
        : JSON.stringify({
            email: signInEmail,
            password: signInPassword,
          }),
    });

    const signInData = await signInRes.json();

    if (signInData && signInData.userId && signInData.success === 'true') {
      if (!token) {
        saveAuthTokenInSession(signInData.token);
      }
      try {
        const profileRes = await fetch(
          `http://localhost:3000/profile/${signInData.userId}`,
          {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              ...(token
                ? { Authorization: `bearer ${token}` }
                : { Authorization: `bearer ${signInData.token}` }),
            },
          }
        );
        const user = await profileRes.json();
        if (user && user.email) {
          loadUser(user);
          onRouteChange('home');
        }
      } catch (err) {
        console.log('profile get lifecycle error:', err);
      }
    }
  };

  return (
    <div className="App">
      <Particles className="particles" params={particlesOptions} />
      <Spinner active={isLoading} text="Loading...">
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={onRouteChange}
          toggleModal={toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={toggleModal}
              loadUser={loadUser}
              onRouteChange={onRouteChange}
              user={user}
            />
          </Modal>
        )}
        <Switch>
          <Route path="/home">
            {isSignedIn ? (
              <Home user={user} setCount={setCount} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/register">
            <Register handleSignIn={handleSignIn} />
          </Route>
          <Route path="/">
            {isSignedIn ? (
              <Home user={user} setCount={setCount} />
            ) : (
              <Signin handleSignIn={handleSignIn} />
            )}
          </Route>
        </Switch>
      </Spinner>
    </div>
  );
};

export default App;
