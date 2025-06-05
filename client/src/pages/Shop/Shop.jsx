import React, { useContext, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Context } from '../..';
import CollectionBar from '../../components/CollectionBar/CollectionBar';
import DesignerBar from '../../components/DesignerBar/DesignerBar';
import ProductList from '../../components/ProductList/ProductList';
import { observer } from 'mobx-react-lite';
import { fetchCollection, fetchDesigner, fetchProduct } from '../../http/productApi';


const Shop = observer(() => {
    const { product } = useContext(Context);

    useEffect(() => {
        fetchCollection().then(data => product.setCollection(data));
        fetchDesigner().then(data => product.setDesigner(data));
    }, [product]);

    useEffect(() => {
        fetchProduct(
            product.selectedCollection?.id,
            product.selectedDesigner?.id,
            product.page,
            20,
            product.sortByPrice
        ).then(data => {
            product.setProduct(data.rows);
            product.setTotalCount(data.count);
        });
    }, [product.selectedCollection, product.selectedDesigner, product.page, product.sortByPrice]);

    return (
        <div style={{ backgroundColor: '#EFEAE0'}}>
        <Container style={{ paddingTop: '90px', backgroundColor: '#EFEAE0', fontFamily: 'Neucha, cursive', color: '#181818'  }}>
            <Row>
                <Col md={3} className="collection-bar">
                    <CollectionBar />
                </Col>
                <Col md={9}>
                    <DesignerBar />
                    <ProductList />
                </Col>
            </Row>
        </Container>
        </div>
    );
});

export default Shop;
