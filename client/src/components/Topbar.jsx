import React from 'react';
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/Topbar.css';

const Topbar = ({ location, cartCount, loginWithRedirect, logout, user }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location}</span>
        </div>
        <ul className="shortcut-menu">
          {!isAuthenticated ? (
            <li>
              <button className="login-btn" onClick={() => loginWithRedirect()}>
                <i className="fas fa-user"></i>
                <span className="login-text">Login</span>
              </button>
            </li>
          ) : (
            <>
              <li><span>Hello, {user.given_name}</span></li>
              <li>
                <button className="logout-btn" onClick={() => logout({ returnTo: window.location.origin })}>
                  Logout
                </button>
              </li>
              <li><Link to="/profile" className="profile-link">Profile</Link></li>
            </>
          )}
          <li className="shopping-bag">
            <a href="#">
              <i className="fas fa-shopping-bag"></i>
              <span className="bag-count">{cartCount}</span> {/* Display cart count */}
              <span className="tooltip">Shopping Bag</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Topbar;

