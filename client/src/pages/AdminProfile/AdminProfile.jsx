import React from 'react';
import image1 from './photo1.jpg';

const User = () => {
    return (
        <div
            style={{
                minHeight: '100vh', // Чтобы фон был на всю высоту страницы
                backgroundColor: '#EFEAE0', // Задний фон
                color: '#181818', // Цвет текста
            }}
        >
            {/* Контейнер для контента, отступ от навбара */}
            <div
                style={{
                    paddingTop: '200px', // Отступ от верхнего контента (например, навбара)
                    textAlign: 'center', // Выравнивание текста по центру
                    paddingBottom: '20px', // Дополнительный отступ снизу
                }}
            >
                {/* Фотография */}
                <img
                    src={image1} // Путь к изображению
                    alt="User"
                    style={{
                        borderRadius: '50%', // Круглая форма изображения
                        width: '150px', // Размер фото
                        height: '150px', // Размер фото
                        marginBottom: '20px', // Отступ снизу
                    }}
                />

                {/* Имя с шрифтом UnlimitedPie */}
                <h1 style={{ fontFamily: "'UnlimitedPie', sans-serif" }}>
                    Тишкевич Мария Николаевна
                </h1>

                {/* Email с шрифтом Neucha */}
                <p style={{ fontFamily: "'Neucha', cursive" }}>
                    email: tishjevich04masha@gmail.com
                </p>
            </div>
        </div>
    );
};

export default User;
