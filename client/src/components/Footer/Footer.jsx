import React from "react";
import "./Footer.css";
import boy from './boy.png'
import logo from './logo.png'

const Footer = () => {
  return (
 <div >
    <div className="footer">
        <img
          src={boy}
          className="absolute-imagee"
          alt="Описание изображения"
        />
        <img
          src={logo}
          className="absolute-image-logo"
          alt="Описание изображения"
        />
        <div  className="textic">
        Наши контакты
        </div>
        <div  className="textic2">
        nasupport@artoyz.com
        </div>
      </div>
 </div>
      
  );
};

export default Footer;
