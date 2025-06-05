import React, { useState} from "react";
import "./About.css";

const About = () => {

  const [pathData, setPathData] = useState(
    'M-1 357L460.5 241.5L1222 293.5L1512 0V890L1222 978.5H146L-1 1216V357Z'
  );

  // Обработчик движения мыши
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Генерация нового пути на основе положения мыши
    const newPath = `
      M${-1 + clientX / 5} ${357 + clientY / 10}
      L${460.5 + clientX / 20} ${241.5 + clientY / 20}
      L${1222 + clientX / 30} ${293.5 + clientY / 30}
      L${1512 + clientX / 50} ${0 + clientY / 50}
      V${890 + clientY / 5}
      L${1222 + clientX / 40} ${978.5 + clientY / 40}
      H${146 + clientX / 60}
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
    <path d={pathData} fill="#FF734D" />
    <text
      x="50%" /* Центрирование по горизонтали */
      y="40%" /* Начальная позиция текста по вертикали */
      textAnchor="middle" /* Выравнивание текста по горизонтали */
      fill="#EFEAE0" /* Цвет текста */
      fontSize="28" /* Размер шрифта */
      fontFamily="'Walter Turncoat', cursive" /* Шрифт */
    >
<tspan x="50%" dy="1.2em">Artoyz - французская компания, специализирующаяся на создании и</tspan>
<tspan x="50%" dy="1.2em">продаже дизайнерских игрушек и фигуринок. Основана в 2003 году, она была</tspan>
<tspan x="50%" dy="1.2em">одной из первых компаний в Франции, которая привлекла внимание к</tspan>
<tspan x="50%" dy="1.2em">культуре собираемых "арт" игрушек. Artoyz сотрудничает с</tspan>
<tspan x="50%" dy="1.2em">известными художниками и дизайнерами со всего мира для</tspan>
<tspan x="50%" dy="1.2em">создания уникальных, ограниченных выпуском виниловых и</tspan>
<tspan x="50%" dy="1.2em">резиновых фигурок. Кроме производства, компания также занимается</tspan>
<tspan x="50%" dy="1.2em">ритейлом и онлайн-продажами, предлагая собирателям и</tspan>
<tspan x="50%" dy="1.2em">фанатам искусства широкий ассортимент эксклюзивных игрушек,</tspan>
<tspan x="50%" dy="1.2em">комиксов и аксессуаров.</tspan>

    </text>
  </svg>
</div>
  );
};

export default About;
