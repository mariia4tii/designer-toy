import React, { useState} from "react";
import "./TrendingProduct.css";
import image1 from './image1.png';
import image2 from './image2.png';
import image3 from './image3.png';
import image4 from './image4.png';
import image5 from './image5.png';
import image6 from './image6.png';
import { SHOP_ROUTE} from '../../utils/Consts';
import { useNavigate } from 'react-router-dom';

const TrendingProduct = () => {
    const navigate = useNavigate();
  const [pathData, setPathData] = useState(
    'M0.5 234L142 353L1222.5 0L1512 234V1551L993.5 1390H508.5L348 1476L0.5 1707.5V234Z'
  );

  // Обработчик движения мыши
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Генерация нового пути на основе положения мыши
    const newPath = `
      M${-1 + clientX / 5} ${357 + clientY / 10}
      L${142 + clientX / 40} ${241.5 + clientY / 20}
      L${1222 + clientX / 30} ${293.5 + clientY / 30}
      L${1512 + clientX / 50} ${0 + clientY / 50}
      V${1551 + clientY / 5}
      L${1222 + clientX / 40} ${978.5 + clientY / 40}
      H${508.5 + clientX / 60}
      L${-1 + clientX / 70} ${1216 - clientY / 10}
      V${357 + clientY / 10}
      Z
    `;
    
    setPathData(newPath); // Обновление пути
  };

  return (
    <div className="main-container" onMouseMove={handleMouseMove}>
      {/* Передаем обновленный pathData в компонент SVG */}
      <svg width="1512" height="1216" viewBox="0 0 1512 1216" fill="none">
        <path d={pathData} fill="#9DD9BF" />
      </svg>
      
      <div className="content">
        <h1 className="title">Трендовые игрушки</h1>
        
        <div className="product-gallery">
          {/* Каталог из 6 фотографий */}
          <div className="product-item">
            <img src={image1} alt="Toy 1" />
          </div>
          <div className="product-item">
            <img src={image2} alt="Toy 2" />
          </div>
          <div className="product-item">
            <img src={image3} alt="Toy 3" />
          </div>
          <div className="product-item">
            <img src={image4} alt="Toy 4" />
          </div>
          <div className="product-item">
            <img src={image5} alt="Toy 5" />
          </div>
          <div className="product-item">
            <img src={image6} alt="Toy 6" />
          </div>
        </div>

        {/* Кнопка для просмотра каталога */}
        <div>
          <button onClick={() => navigate(SHOP_ROUTE)} className="view-more-btn">Посмотреть каталог</button>
        </div>
      </div>
    </div>
  );
};

export default TrendingProduct;
