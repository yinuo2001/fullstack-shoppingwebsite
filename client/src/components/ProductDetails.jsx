import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Topbar from './Topbar';
import '../css/ProductDetails.css';

const ProductDetails = ({ isLoggedIn, addToCart, cartCount, setCartCount }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [location, setLocation] = useState('Loading location...');

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
        setLocation('Unable to load location');
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
        console.log('Product data:', response.data);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchLocation();
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (isLoggedIn) {
      try {
        await addToCart(product);
        setCartCount(prevCount => prevCount + 1);
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    } else {
      alert('Please log in to add items to the cart.');
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <Topbar location={location} cartCount={cartCount} />
      <header className="header">
        <a href="/" className="main-header">Style Haven</a>
      </header>
      <div className="product-container">
        <img src={`/${product.picture}`} alt={product.name} className="product-image" />
        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>
          <button onClick={handleAddToCart} className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
