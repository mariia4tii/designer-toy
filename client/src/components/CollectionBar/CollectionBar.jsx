import React from 'react';
import { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';

const TypeBar = observer(() => {
    const { product } = useContext(Context);
    return (
        <ListGroup
            style={{
                paddingTop: '90px',
                backgroundColor: '#EFEAE0',
                fontFamily: 'Neucha, cursive',
                color: '#181818',
                fontSize: '32px', // Задаем размер шрифта
            }}
        >
            {product.collection.map(collection => (
                <ListGroup.Item
                    style={{
                        cursor: 'pointer',
                        backgroundColor: '#EFEAE0',
                        border: `2px solid #181818`, // Обводка блоков
                        borderRadius: '5px', // Немного скругляем углы
                        marginBottom: '5px', // Добавляем отступ между блоками
                    }}
                    active={collection.id === product.selectedCollection.id}
                    onClick={() => product.setSelectedCollection(collection)}
                    key={collection.id}
                >
                    {collection.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
});

export default TypeBar;
