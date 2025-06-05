// components/Profile/UserOrders.jsx
import React, { useEffect, useState } from 'react';
import { $authHost } from '../../http/index';
import './UserOrders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('id');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await $authHost.get(`/api/order-stats/${userId}`);
                setOrders(response.data);
            } catch (err) {
                console.error('Ошибка при загрузке заказов:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) return <div className="basket-container"><p>Загрузка заказов...</p></div>;

    return (
        <div className="basket-container">
            <div className="basket-content">
                <h1 className="basket-title">Мои заказы</h1>
                {orders.length === 0 ? (
                    <p>У вас пока нет заказов.</p>
                ) : (
                    <ul className="basket-list">
                        {orders.map(order => (
                            <li key={order.order_id} className="basket-item">
                                <p><strong>ID заказа:</strong> {order.order_id}</p>
                                <p><strong>Email:</strong> {order.email}</p>
                                <p><strong>Дата:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                <p><strong>Статус:</strong> {order.status}</p>
                                <p><strong>Позиций:</strong> {order.total_items}</p>
                                <p><strong>Сумма:</strong> {order.total_price} ₽</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
