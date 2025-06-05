import React, { useState} from "react";
import "./Designers.css";
import imaged1 from './imaged1.png';
import imaged2 from './imaged2.png';
import imaged3 from './imaged3.png';

const Designers = () => {

  const [pathData, setPathData] = useState(
    'M-1 357L460.5 241.5L1222 293.5L1512 0V890L1222 978.5H146L-1 1216V357Z'
  );

  // Обработчик движения мыши
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Генерация нового пути на основе положения мыши
    const newPath = `
     M${0 + clientX / 10} ${231.598 + clientY / 20}
      L${163.432 + clientX / 30} ${122.052 + clientY / 30}
      L${397.05 + clientX / 40} ${135.558 + clientY / 40}
      L${582.04 + clientX / 50} ${0 + clientY / 50}
      L${1093.89 + clientX / 60} ${122.052 + clientY / 60}
      L${1281.5 + clientX / 70} ${0 + clientY / 70}
      L${1512 + clientX / 80} ${73.5312 + clientY / 80}
      V${1231 + clientY / 10}
      L${1297 + clientX / 90} ${1123 + clientY / 90}
      H${850 + clientX / 100}
      L${436.5 + clientX / 110} ${836.5 + clientY / 110}
      L${308 + clientX / 120} ${1173.5 + clientY / 120}
      L${0 + clientX / 130} ${1394 + clientY / 130}
      V${231.598 + clientY / 130}
      Z
    `;
    
    setPathData(newPath); // Обновление пути
  };


  return (
     <div className="main-container1" onMouseMove={handleMouseMove}>
  {/* Передаем обновленный pathData в компонент SVG */}
  <svg width="1512" height="1216" viewBox="0 0 1512 1216" fill="none">
    <path d={pathData} fill="#98AEFA" />
  </svg>
  <div className="content">
        <h1 className="title1">наши дизайнеры</h1>
        
        <div className="product-gallery1">
          {/* Каталог из 6 фотографий */}
          <div className="product-item1">
            <img src={imaged1} alt="Toy 1" />
          </div>
          <div className="product-item1">
            <img src={imaged2} alt="Toy 2" />
          </div>
          <div className="product-item1">
            <img src={imaged3} alt="Toy 3" />
          </div>
        </div>
      </div>
</div>
  );
};

export default Designers;
