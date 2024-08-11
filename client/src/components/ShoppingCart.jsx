import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Topbar from "./Topbar";
import { useAuthToken } from "../AuthTokenContext";
import "../css/ShoppingCart.css";


const ShoppingCart = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState("Loading location...");
  const [cartCount, setCartCount] = useState(0);
  const { accessToken } = useAuthToken();

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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-user/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const cartProducts = response.data;
          setProducts(cartProducts);
          setCartCount(cartItems.length);
        } else {
          console.error("Error fetching products in the cart:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products in the cart:", error);
      }
    };
    fetchProducts();
  }, [cartItems, accessToken]);

  // Handle remove product from cart
  const handleRemoveProduct = async (productId) => {
    try {
      // await axios.post('http://localhost:8000/verify-user/remove-from-cart', { productId });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-user/products/${productId}}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        setCartCount(cartCount - 1);
        setCartItems(cartItems.filter(id => id !== productId));
      }
    } catch (error) {
      console.error("Error removing product from the cart:", error);
    }
  };

  return (
    <div className="shopping-cart">
      <Topbar location={location} cartCount={cartCount} />
      
      {/* header */}
      <header className="header">
        <Link to="/" className="main-header">Style Haven</Link>
      </header>

      <div className="cart-container">
        {products.length === 0 ? (
          <p>The cart is empty</p>
        ) : (
          <div className="cart-items">
            {products.map((product) => (
              <div key={product.id} className="cart-item">
                <img src={product.picture} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                </div>
                <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;
