import React from 'react';
import { Link } from 'react-router-dom';

import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ProfileIcon
          style={{ cursor: 'pointer' }}
          onRouteChange={onRouteChange}
          toggleModal={toggleModal}
        />
      </nav>
    );
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/">
          <p className="f3 link dim black pa3 pointer">Sign In</p>
        </Link>
        <Link to="/register">
          <p className="f3 link dim black pa3 pointer">Register</p>
        </Link>
      </nav>
    );
  }
};

export default Navigation;
