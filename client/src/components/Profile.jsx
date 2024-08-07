import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import "../css/Profile.css";

const Profile = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("Loading location...");
  const [cartCount, setCartCount] = useState(0);

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
      if (isAuthenticated) {
        try {
          const response = await axios.get('http://localhost:8000/verify-user');
          setProfile(response.data);
          setName(response.data.name);
          setEmail(response.data.email);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        loginWithRedirect();
      }
    };

    fetchLocation();
    fetchProfile();
  }, [isAuthenticated, user.email, loginWithRedirect]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put('http://localhost:8000/verify-user', { name, email });
      const response = await axios.get('http://localhost:8000/verify-user');
      setProfile(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Topbar location={location} cartCount={cartCount} />
      
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <button className="button" onClick={handleUpdateProfile}>Update</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
