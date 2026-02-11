import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [category, setCategory] = useState('All');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('section') === 'menu') {
      const el = document.getElementById('explore-menu');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 0);
      }
    }
  }, [location]);

  return (
    <>
      <Header />
      <ExploreMenu setCategory={setCategory} category={category} />
      <FoodDisplay category={category} />
    </>
  );
};

export default Home;
