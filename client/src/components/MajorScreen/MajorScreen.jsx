import React from "react";
import "./MajorScreen.css";
import toymImage from './MajorScreenimage/toym1.png'
import {ReactComponent as ArtoyzImage} from './MajorScreenimage/artoyz.svg'
import korobka1Image from './MajorScreenimage/korobka1.png'
import korobka2Image from './MajorScreenimage/korobka2.png'
import korobka3Image from './MajorScreenimage/korobka3.png'

const MajorScreen = () => {
  return (
 <div>
    <div className="hero">
        <img
          src={toymImage}
          className="absolute-image"
          alt="Описание изображения"
        />
      </div>
      <ArtoyzImage className="artoyz-image-style" />
      <div >
        <img
          src={korobka1Image}
          className="absolute-image-korob1"
          alt="Описание изображения"
        />
      </div>
      <div>
        <img
          src={korobka2Image}
          className="absolute-image-korob2"
          alt="Описание изображения"
        />
      </div>
      <div>
        <img
          src={korobka3Image}
          className="absolute-image-korob3"
          alt="Описание изображения"
        />
      </div>
 </div>
      
  );
};

export default MajorScreen;
