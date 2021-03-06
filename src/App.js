import React, { useState, useEffect } from 'react';
import Particles from 'react-particles-js';
import { Switch, Route, Redirect } from 'react-router-dom';
import AWS from 'aws-sdk';

import Navigation from './Containers/Navigation/Navigation';
import Signin from './Containers/Signin/Signin';
import Register from './Containers/Register/Register';
import Modal from './components/Modal/Modal';
import Profile from './Containers/Profile/Profile';
import Home from './Containers/Home/Home';
import Spinner from './components/Spinner/Spinner';
import ErrorModal from './components/ErrorModal/ErrorModal';
import './App.css';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
});

const s3 = new AWS.S3();

const encode = (data) => {
  var str = data.reduce(function (a, b) {
    return a + String.fromCharCode(b);
  }, '');
  return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
};

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
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePic, setProfilePic] = useState('');

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
      setProfilePic('');
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
  };

  const toggleModal = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleError = () => {
    if (isErrorOpen) {
      setErrorMessage('');
    }
    setIsErrorOpen(!isErrorOpen);
  };

  const saveAuthTokenInSession = (token) => {
    window.sessionStorage.setItem('token', token);
  };

  const getProfilePic = (userId) => {
    s3.getObject(
      { Bucket: 'smart-brain-profile-pic', Key: `${userId}_profile_pic.png` },
      (err, data) => {
        if (err) {
          console.log('profile pic err:', err);
        } else {
          setProfilePic(`data:image/jpeg;base64,${encode(data.Body)}`);
        }
      }
    );
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

    if (!signInRes.ok) {
      setErrorMessage('There was an error signing in. Try again.');
      toggleError();
    }

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
          getProfilePic(user.id);
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
          profilePic={profilePic}
        />
        {isErrorOpen && (
          <Modal>
            <ErrorModal errorMessage={errorMessage} toggleError={toggleError} />
          </Modal>
        )}
        {isProfileOpen && (
          <Modal>
            <Profile
              toggleModal={toggleModal}
              loadUser={loadUser}
              onRouteChange={onRouteChange}
              user={user}
              setErrorMessage={setErrorMessage}
              toggleError={toggleError}
              profilePic={profilePic}
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
            <Register
              handleSignIn={handleSignIn}
              setErrorMessage={setErrorMessage}
              toggleError={toggleError}
            />
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
