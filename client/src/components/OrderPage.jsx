import React from 'react';

const OrdersPage = ({ onGoToChart }) => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Управление заказами</h1>

            <button
                onClick={onGoToChart}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF734D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Перейти к диаграмме
            </button>
        </div>
    );
};

export default OrdersPage;
