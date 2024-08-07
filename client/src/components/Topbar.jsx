import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/Topbar.css';

const Topbar = ({ location, cartCount, loginWithRedirect, logout, user }) => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleShoppingBagClick = () => {
    if (isAuthenticated) {
      navigate("/shopping-cart");
    } else {
      loginWithRedirect();
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    setProfileOpen(false);
  };

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
              <li className="user-info">
                <button className="avatar-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <img src="https://img.ixintu.com/download/jpg/201912/a875dd9e8abebbaeee28ef1bfd01d16f.jpg!ys" alt="User Avatar" className="user-avatar" />
                </button>
                {profileOpen && (
                  <div className="profile-menu">
                    <span className="user-name">Hello, {user.name.split('@')[0]}</span>
                    <Link to="/profile" className="profile-link" onClick={() => setProfileOpen(false)}>
                    <i className="fa-sharp fa-regular fa-user profile-icon"></i> My Profile</Link>
                    <button className="logout-btn" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt logout-icon"></i> Log out
                    </button>
                  </div>
                )}
              </li>
            </>
          )}
          <li className="shopping-bag">
            <button onClick={handleShoppingBagClick} className="shopping-bag-link">
              <i className="fas fa-shopping-bag"></i>
              <span className="bag-count">{cartCount}</span> {/* Display cart count */}
              <span className="tooltip">Shopping Bag</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Topbar;

