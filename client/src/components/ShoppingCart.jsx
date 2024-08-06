import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import '../css/ShoppingCart.css';

const ShoppingCart = ({ cartItems }) => {
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState("Loading location...");
  const [cartCount, setCartCount] = useState(0);

  // Fetch location data
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
  }, []);

  // Fetch products in the cart
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/verify-user/products');
        const cartProducts = response.data.filter(product => cartItems.includes(product.id));
        setProducts(cartProducts);
        setCartCount(cartItems.length);
      } catch (error) {
        console.error("Error fetching products in the cart:", error);
      }
    };
    fetchProducts();
  }, [cartItems]);

  return (
    <div className="product-details">
      <Topbar location={location} cartCount={cartCount} />
      <header className="header">
        <a href="/" className="main-header">Style Haven</a>
        <div className="cart-container">
          {products.length === 0 ? (
            <p>The cart is empty</p>
          ) : (
            <div className="cart-items">
              {products.map((product) => (
                <div key={product.id} className="cart-item">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default ShoppingCart;
