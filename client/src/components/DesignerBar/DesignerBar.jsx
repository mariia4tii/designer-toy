import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Card, Row } from 'react-bootstrap';
import { Context } from '../../index';

const DesignerBar = observer(() => {
    const { product } = useContext(Context);

    return (
        <Row
            className="d-flex"
            style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "20px",
            }}
        >
            {product.designer.map((designer) => (
                <Card
                    style={{
                        cursor: "pointer",
                        width: "25%",
                        fontSize: "24px", // Размер шрифта
                        fontFamily: 'Neucha, cursive', // Шрифт
                        backgroundColor:
                            designer.id === product.selectedDesigner.id
                                ? "#9DD9BF" // Цвет фона при нажатии
                                : "#EFEAE0", // Изначальный фон
                        border: `2px solid ${
                            designer.id === product.selectedDesigner.id
                                ? "#9DD9BF" // Обводка при нажатии
                                : "#181818" // Изначальная обводка
                        }`,
                        textAlign: "center", // Выравнивание текста по центру
                        padding: "10px",
                        transition: "0.3s", // Анимация изменения стиля
                    }}
                    className="p-3"
                    key={designer.id}
                    onClick={() => product.setSelectedDesigner(designer)}
                >
                    {designer.name}
                </Card>
            ))}
        </Row>
    );
});

export default DesignerBar;
