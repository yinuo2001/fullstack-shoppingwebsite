import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/FashionList.css";


const FashionList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/fashion-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching fashion products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list">
      <h2>Fashion Products</h2>
      <div className="products">
        {products.map(product => (
          <div key={product.id} className="product">
            <img src={product.image_path} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price} 元</p>
            <Link to={`/products/${product.id}`}>查看详情</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionList;
