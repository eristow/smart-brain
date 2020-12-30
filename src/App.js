import React, { Component } from 'react';
import Particles from 'react-particles-js';
import { Switch, Route, Redirect } from 'react-router-dom';

import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const particlesOptions = {
  //customize this to your liking
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

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    pet: '',
    age: '',
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`http://localhost:3000/profile/${data.id}`, {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            })
              .then((res) => res.json())
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
              .catch((err) => {
                console.log('profile get lifecycle error:', err);
              });
          }
        })
        .catch((err) => {
          console.log('signIn lifecycle error:', err);
        });
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        pet: data.pet,
        age: data.age,
      },
    });
  };

  calculateFaceLocations = (data) => {
    if (data && data.outputs) {
      const clarifaiFaces = data.outputs[0].data.regions;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      const faceBoxes = clarifaiFaces.map((face) => {
        const currentBox = face.region_info.bounding_box;
        return {
          id: face.id,
          leftCol: currentBox.left_col * width,
          topRow: currentBox.top_row * height,
          rightCol: width - currentBox.right_col * width,
          bottomRow: height - currentBox.bottom_row * height,
        };
      });
      return faceBoxes;
    }
    return;
  };

  displayFaceBoxes = (boxes) => {
    if (boxes) {
      this.setState({ boxes: boxes });
    }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: window.sessionStorage.getItem('token'),
            },
            body: JSON.stringify({
              id: this.state.user.id,
              count: response.outputs ? response.outputs[0].data.regions.length : 0,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBoxes(this.calculateFaceLocations(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      window.sessionStorage.removeItem('token');
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const { isSignedIn, isProfileOpen, imageUrl, boxes, user } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
              user={user}
            />
          </Modal>
        )}
        <Switch>
          <Route path="/home">
            {isSignedIn ? (
              <div>
                <Logo />
                <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
              </div>
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/register">
            <Register
              loadUser={this.loadUser}
              onRouteChange={this.onRouteChange}
            />
          </Route>
          <Route path="/">
            {!isSignedIn ? (
              <Signin
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
            ) : (
              <div>
                <Logo />
                <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
              </div>
            )}
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
