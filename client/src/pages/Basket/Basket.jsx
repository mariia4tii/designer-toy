import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import basketStore from "../../store/BasketStore";
import './Basket.css';
import OrderModal from "../../components/OrderModel/OrderModel"; // путь подгони под свою структуру

import { $authHost } from "../../http/index";

const BasketComponent = observer(() => {
    const [loading, setLoading] = useState(true);
    const [orderSuccess, setOrderSuccess] = useState(false); 
    const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({ name: '', address: '', phone: '' });

const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const submitOrder = async () => {
    try {
        const response = await $authHost.post('/api/order', {
            userId: localStorage.getItem('id'),
            customer_name: formData.name,
            address: formData.address,
            phone: formData.phone,
            items: basketStore.basketProducts.map(p => ({
                product_id: p.product_id,
                quantity: p.ct,
                price: p.product_price
            }))
            
        });

        if (response.status === 200) {
            setOrderSuccess(true);
            basketStore.clearBasket();
            setShowForm(false);
        }
    } catch (err) {
        console.error('Ошибка при оформлении заказа', err);
    }
};
// Для отображения сообщения

    useEffect(() => {
        const fetchData = async () => {
            await basketStore.fetchBasket();
            setLoading(false);
        };
        fetchData();
    }, []);

    const clearBasket = async () => {
        await basketStore.clearBasket(); // Предполагается, что этот метод есть и очищает на бэке
        setOrderSuccess(false); // Очистка сообщения
    };

    const handleOrder = () => {
        setShowForm(true); // Показываем форму
    };
    
    

    if (loading) return <div>Загрузка...</div>;

    return (
        <div className="basket-container">
            <div className="basket-content">
                <h1 className="basket-title">Корзина</h1>
                {basketStore.basketProducts?.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <>
                        <ul className="basket-list">
                            {basketStore.basketProducts.map((product) => (
                                <li key={product.id} className="basket-item">
                                    {product.product_name} — {product.ct} шт. — {product.product_price * product.ct} руб.
                                </li>
                            ))}
                        </ul>
                        <p className="basket-total-count">Общее количество: {basketStore._totalItems}</p>
                        <p className="basket-total-sum">Общая сумма: {basketStore._totalPrice} руб.</p>

                        <button className="basket-clear-btn" onClick={handleOrder}>
                                    Оформить заказ
                                </button>

                                {showForm && (
                                            <OrderModal
                                                formData={formData}
                                                setFormData={setFormData}
                                                submitOrder={submitOrder}
                                                onClose={() => setShowForm(false)}
                                            />
                                        )}



                        <button className="basket-clear-btn" onClick={clearBasket}>
                            Очистить корзину
                        </button>
                    </>
                )}

                {orderSuccess && <p className="order-success-msg">Заказ оформлен успешно!</p>}
            </div>
        </div>
    );
});

export default BasketComponent;
