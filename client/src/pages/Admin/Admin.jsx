import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Designerfunc from '../../components/Designerfunc/Designerfunc';
import Userfunc from '../../components/Userfunc/Userfunc';
import Collectionfunc from '../../components/Collectionfunc/Collectionfunc';
import CreateCollection from '../../components/Modal/CreateCollection';
import Productfunc from '../../components/Productfunc/Productfunc';
import ImportOrders from '../../components/ImportOrders';
import AdminOrders from '../../components/AdminOrder/AdminOrder';
import AdminDesigns from '../../components/AdminDesigns/AdminDesigns'; // Добавь свой путь

import './Admin.css';

const buttonStyle = {
    backgroundColor: '#98AEFA',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.3s ease',
    width: '100%',
    margin: '10px 0',
    maxWidth: '1000px',
};

const hoverStyle = {
    backgroundColor: '#7a94f0',
};

const Admin = () => {
    const [designerVisible, setDesignerVisible] = useState(false);
    const [showUserFunc, setShowUserFunc] = useState(false);
    const [showCollectionFunc, setShowCollectionFunc] = useState(false);
    const [productVisible, setProductVisible] = useState(false);
    const [collectionVisible, setCollectionVisible] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showOrderManager, setShowOrderManager] = useState(false);
    const [showDesignManager, setShowDesignManager] = useState(false); // новый стейт
    const [hovered, setHovered] = useState(null);

    const renderButton = (label, onClick, index) => (
        <button
            style={{
                ...buttonStyle,
                ...(hovered === index ? hoverStyle : {}),
            }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onClick={onClick}
        >
            {label}
        </button>
    );

    return (
        <div style={{
            backgroundColor: '#EFEAE0',
            width: '100%',
            fontFamily: 'Neucha, cursive',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 10px',
            minHeight: '100vh',
        }}>
            <Container fluid style={{
                paddingTop: '90px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100vh',
                overflowY: 'auto',
            }}>
                {showChart ? (
                    <>
                        {renderButton('Назад', () => setShowChart(false), 0)}
                        <ImportOrders />
                    </>
                ) : showOrderManager ? (
                    <>
                        {renderButton('Назад', () => setShowOrderManager(false), 0)}
                        <AdminOrders />
                    </>
                ) : showDesignManager ? (
                    <>
                        {renderButton('Назад', () => setShowDesignManager(false), 0)}
                        <AdminDesigns />
                    </>
                ) : designerVisible ? (
                    <>
                        {renderButton('Назад', () => setDesignerVisible(false), 0)}
                        <div style={{ width: '100%', height: '100%' }}>
                            <Designerfunc />
                        </div>
                    </>
                ) : showUserFunc ? (
                    <>
                        {renderButton('Назад', () => setShowUserFunc(false), 0)}
                        <div style={{ width: '100%', height: '100%' }}>
                            <Userfunc />
                        </div>
                    </>
                ) : showCollectionFunc ? (
                    <>
                        {renderButton('Назад', () => setShowCollectionFunc(false), 0)}
                        <div style={{ width: '100%', height: '100%' }}>
                            <Collectionfunc />
                        </div>
                    </>
                ) : productVisible ? (
                    <>
                        {renderButton('Назад', () => setProductVisible(false), 0)}
                        <div style={{ width: '100%', height: '100%' }}>
                            <Productfunc />
                        </div>
                    </>
                ) : (
                    <>
                        {renderButton('Работа с дизайнерами', () => setDesignerVisible(true), 1)}
                        {renderButton('Работа с юзерами', () => setShowUserFunc(true), 2)}
                        {renderButton('Работа с коллекциями', () => setShowCollectionFunc(true), 3)}
                        {renderButton('Работа с товарами', () => setProductVisible(true), 4)}
                        {renderButton('Управление заказами', () => setShowChart(true), 5)}
                        {renderButton('Управление статусами заказов', () => setShowOrderManager(true), 6)}
                        {renderButton('Управление дизайнами', () => setShowDesignManager(true), 7)} {/* НОВАЯ КНОПКА */}
                    </>
                )}

                {collectionVisible && (
                    <CreateCollection onClose={() => setCollectionVisible(false)} />
                )}
            </Container>
        </div>
    );
};

export default Admin;
