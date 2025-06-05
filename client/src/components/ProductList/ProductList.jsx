import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Context } from '../..';
import ProductItem from '../ProductItem/ProductItem';

const ProductList = observer(() => {
    const { product } = useContext(Context);

    return (
        <div style={{ backgroundColor: '#EFEAE0', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {product.product.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            flex: '0 0 calc(50% - 10px)', // Два элемента в строке
                            boxSizing: 'border-box',
                            marginBottom: '-200px', // Уменьшил вертикальное расстояние между строками
                        }}
                    >
                        <ProductItem product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
});

export default ProductList;
