import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../utils/Consts';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();
    console.log('Полный путь к изображению:', process.env.REACT_APP_API_URL + product.image_url);

    return (
        <div style={{ backgroundColor: '#EFEAE0', minHeight: '100vh', padding: '20px' }}>
            <Col 
                md={6} 
                lg={6} 
                className="mt-4" 
                onClick={() => navigate(PRODUCT_ROUTE + "/" + product.id)}
            >
                <Card style={{ width: 402, cursor: 'pointer', backgroundColor: '#EFEAE0', borderColor: '#181818' }}>
                    <img
                        src={process.env.REACT_APP_API_URL + product.image_url}
                        alt={product.name}
                        width="400"
                        height="400"
                    />
                    <div style={{ fontFamily: 'Neucha, cursive', fontSize: '24px', color: '#181818', textAlign: 'center' }}>
                        {product.name}
                    </div>
                    <div style={{ fontFamily: 'Neucha, cursive', fontSize: '20px', color: '#181818', textAlign: 'center' }}>
                        {product.price}
                    </div>
                </Card>
            </Col>
        </div>
    );
};

export default ProductItem;
