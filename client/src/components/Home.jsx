import React, { useEffect, useState } from "react";
import "../css/Home.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [location, setLocation] = useState("Loading location...");

  const images = [
    "res/home-slider-01.webp",
    "res/home-slider-02.webp",
    "res/home-slider-03.webp"
  ];


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

    fetchLocation();

    // 需修改 
    if (!isAuthenticated) {
      fetch("/api/products")
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setCartCount(data.length);
        });
    }
  }, [isAuthenticated]);

  const handlePrev = () => {
    const newIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="home">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-content">
          <div className="location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{location}</span>
          </div>
          <ul className="shortcut-menu">
            <li>
              <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <button className="search-btn">
                <i className="fas fa-search"></i>
                </button>
              </div>
            </li>
            {!isAuthenticated ? (
              <li><button className="login-btn" onClick={loginWithRedirect}>
                <i className="fas fa-user"></i>
                <span className="login-text">Login</span>
                </button>
              </li>
            ) : (
              <>
                <li><span>Hello, {user.given_name}</span></li>
                <li><button className="logout-btn" onClick={() => logout({ returnTo: window.location.origin })}>Logout</button></li>
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

      {/* Header */}
      <header className="header">
        <p className="main-header">Style Haven</p>
      </header>

      {/* Navigation Bar */}
      <nav className="nav">
        <a href="#">Fashion</a>
        <a href="#">High Jewelry</a>
        <Link to="/comment">Comment</Link>
      </nav>

      {/* Image Slider */}
      <div className="image-slider">
        <button className="prev-btn" onClick={handlePrev}>
          <i className="fas fa-angle-left"></i>
        </button>
        <ul className="slider" style={{ transform: `translateX(${-currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <li key={index}>
              <a href="#"><img src={image} alt={`Slider Image ${index + 1}`} /></a>
            </li>
          ))}
        </ul>
        <button className="next-btn" onClick={handleNext}>
          <i className="fas fa-angle-right"></i>
        </button>
      </div>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
          <p>&copy; 2024 Style Haven </p>
        </div>
      </footer>     

  


    </div>
  );
}

export default Home;
