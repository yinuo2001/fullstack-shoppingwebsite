import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import Profile from "./components/Profile";
import FashionList from "./components/FashionList";
import JewelryList from "./components/JewelryList";
import ProductDetails from "./components/ProductDetails";
import Comment from "./components/Comment";
import { AuthTokenProvider } from "./AuthTokenContext";

function App() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    if (isLoggedIn) {
      try {
        // Add product to cart
        const response = await axios.put('http://localhost:8000/verify-user/products', {
          productId: product.id,
        });
        if (response.status === 200) {
          console.log(`Product added to cart: ${product.name}`);
        } else {
          console.error('Failed to add product to cart:', response.status);
          alert('Failed to add item to cart. Please try again.');
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
      }
    } else {
      alert('Please log in to add items to the cart.');
      loginWithRedirect();
    }
  };

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/verify-user`}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    >
      <AuthTokenProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/fashion-products" element={<FashionList />} />
            <Route path="/jewelry-products" element={<JewelryList />} />
            <Route 
              path="/products/:id" 
              element={<ProductDetails isLoggedIn={isLoggedIn} addToCart={addToCart} />} 
            />
            <Route path="/comment" element={<Comment />} />
          </Routes>
        </Router>
      </AuthTokenProvider>  
    </Auth0Provider>
  );
}

export default App;
