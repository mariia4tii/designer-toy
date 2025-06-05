import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [] });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:5002/api/products/${id}`)
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(e => setError('Не удалось загрузить данные о продукте.'));
    }, [id]);

    const handleAddToBasket = async () => {
        try {
            const userId = +localStorage.getItem('id');
            const response = await fetch(`http://localhost:5002/api/basket/product/${product.id}/append`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: 1, userId }),
            });

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.statusText}`);
            }

            const updatedBasket = await response.json();
            setMessage('Товар успешно добавлен в корзину!');
            setError('');
            console.log('Обновленная корзина:', updatedBasket);
        } catch (e) {
            console.error('Ошибка при добавлении товара:', e.message);
            setError('Не удалось добавить товар в корзину. Попробуйте снова.');
            setMessage('');
        }
    };

    return (
        <div style={{ backgroundColor: '#EFEAE0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>

                {/* Название и рейтинг */}
                <div style={{ fontFamily: "'UnlimitedPie', sans-serif", textAlign: 'center', marginTop: '20px' }}>
                    <h2>{product.name}</h2>
                    <div style={{ fontSize: '64px', color: '#181818' }}>
                        {product.rating}
                    </div>
                </div>

                {/* Цена */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h3 style={{ fontFamily: 'Neucha, cursive', fontSize: '32px' }}>
                        От: {product.price} руб.
                    </h3>
                </div>

                {/* Оранжевая кнопка */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={handleAddToBasket}
                        style={{
                            fontFamily: 'Neucha, cursive',
                            padding: '10px 20px',
                            fontSize: '18px',
                            backgroundColor: '#FF734D',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease, background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#FF734D';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#FF734D';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        Добавить в корзину
                    </button>
                </div>

                {/* Описание */}
                <div style={{ marginTop: '40px', width: '60%', textAlign: 'center' }}>
                    <h3 style={{ fontFamily: "'UnlimitedPie', sans-serif", fontSize: '24px', marginBottom: '20px' }}>
                        описание
                    </h3>
                    <p style={{
                        fontFamily: 'Neucha, cursive',
                        fontSize: '36px', // в 2 раза больше, чем обычно (18px)
                        color: '#181818',
                        lineHeight: '1.6'
                    }}>
                        {product.description}
                    </p>
                </div>

                {/* Сообщения */}
                <div style={{ marginTop: '20px' }}>
                    {message && (
                        <div style={{
                            backgroundColor: '#D4EDDA',
                            color: '#155724',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '10px'
                        }}>
                            {message}
                        </div>
                    )}
                    {error && (
                        <div style={{
                            backgroundColor: '#F8D7DA',
                            color: '#721C24',
                            padding: '10px',
                            borderRadius: '5px'
                        }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
