import React from 'react';
import About from '../../components/About/About';
import MajorScreen from '../../components/MajorScreen/MajorScreen';
import Footer from '../../components/Footer/Footer';
import TrendingProduct from '../../components/TrendingProduct/TrendingProduct';
import Designers from '../../components/Designers/Designers';


const HomePage = () => {


  return (
    <div>
    <MajorScreen />
    <About />
    <TrendingProduct/>
    <Designers/>
    
  </div>
   
  );
};

export default HomePage;
