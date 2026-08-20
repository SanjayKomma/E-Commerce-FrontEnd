import React from 'react'
import api from '../../services/api';
import { useEffect, useState } from 'react';
export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Electronics", "Clothing", "Accessories"];
  
   useEffect(()=>{
    const fetchProducts = async () => {
      try{
        setLoading(true);
        const response = await api.get('/products', {
          withCredentials: true,
        });
        const items = response.data?.products || (Array.isArray(response.data) ? response.data : []);
        setProducts(items);
      }
      catch(error){
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  }
  return (
    <div>HomePage</div>
  )
}
export default HomePage;