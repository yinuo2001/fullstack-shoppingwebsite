import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import "../css/Profile.css";

const Profile = () => {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Loading location...");
  const [cartCount, setCartCount] = useState(0);

  const { accessToken } = useAuthToken();

  useEffect(() => {
    const fetchLocation = async () => {
      const options = {
        method: 'GET',
        url: 'https://ip-geo-location.p.rapidapi.com/ip/check',
        params: {
          format: 'json',
          language: 'en'
        },
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
          'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        const { city, country } = response.data;
        setLocation(`${city.name}, ${country.name}`);
      } catch (error) {
        console.error('Error fetching location data:', error);
        setLocation("Unable to load location");
      }
    };

    const fetchProfile = async () => {
      if (user && isAuthenticated) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
          }

        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        loginWithRedirect();
      }
    };

    fetchLocation();
    fetchProfile();
  }, [isAuthenticated, user?.email, loginWithRedirect]);

  return (
    <div>
      <Topbar
        location={location}
        cartCount={cartCount}
        loginWithRedirect={loginWithRedirect} 
        logout={logout} 
        user={user}
      />
      
      {/* header */}
      <header className="header">
        <Link to="/" className="main-header">Style Haven</Link>
      </header>   

      <div className="profile">
        <section className="profile-info">
          <div className="container box-items">
            <h1>Account Information</h1>
            <div className="content">
              <div className="right">
                <label>Email:</label>
                <input
                  type="text"
                  value={email || ''}
                  readOnly
                  required
                />
                <label>Name:</label>
                <input
                  type="text"
                  value={name.split("@")[0] || ''}
                  readOnly
                  required
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
