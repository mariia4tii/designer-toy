import React from "react";
import "./OrderModel.css";

const OrderModal = ({ formData, setFormData, submitOrder, onClose }) => {
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2 className="modal-title">Оформление заказа</h2>
                <div className="modal-form">
                    <input
                        className="modal-input"
                        name="name"
                        placeholder="Имя"
                        onChange={handleInputChange}
                        value={formData.name}
                    />
                    <input
                        className="modal-input"
                        name="address"
                        placeholder="Адрес доставки"
                        onChange={handleInputChange}
                        value={formData.address}
                    />
                    <input
                        className="modal-input"
                        name="phone"
                        placeholder="Телефон"
                        onChange={handleInputChange}
                        value={formData.phone}
                    />
                    <button className="modal-button" onClick={submitOrder}>Подтвердить заказ</button>
                    <button className="modal-close" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
