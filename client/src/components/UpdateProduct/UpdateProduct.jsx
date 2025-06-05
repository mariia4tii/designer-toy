import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; // Для навигации
import { updateProduct } from '../../http/productApi'; // Импортируем API для обновления продукта
import { getProductById } from '../../http/productApi'; // Импортируем API для получения данных о продукте

const UpdateProductForm = () => {
    const { id } = useParams(); // Получаем id продукта из URL
    const navigate = useNavigate(); // Для перенаправления после обновления
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        collectionId: '',
        designerId: '',
        image: null,
    });

    // Загружаем данные продукта при первом рендере
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProductById(id);
                setProduct(productData);
            } catch (error) {
                console.error("Ошибка при загрузке продукта:", error);
            }
        };
        fetchProduct();
    }, [id]);

    // Обработка изменений в форме
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    // Обработка выбора нового файла изображения
    const handleFileChange = (e) => {
        setProduct((prevProduct) => ({
            ...prevProduct,
            image: e.target.files[0],
        }));
    };

    // Обработка отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProductData = new FormData();
        updatedProductData.append('name', product.name);
        updatedProductData.append('description', product.description);
        updatedProductData.append('price', product.price);
        updatedProductData.append('stock', product.stock);
        updatedProductData.append('collection_id', product.collectionId);
        updatedProductData.append('designer_id', product.designerId);
        if (product.image) {
            updatedProductData.append('image', product.image); // Добавляем изображение, если оно есть
        }

        try {
            const updatedProduct = await updateProduct(id, updatedProductData);
            navigate(`/products/${updatedProduct.id}`); // Перенаправляем на страницу обновленного продукта
        } catch (error) {
            console.error("Ошибка при обновлении продукта:", error);
        }
    };

    return (
        <div>
            <h1>Обновить продукт</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        type="text"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formPrice">
                    <Form.Label>Цена</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formStock">
                    <Form.Label>Количество</Form.Label>
                    <Form.Control
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formCollectionId">
                    <Form.Label>ID коллекции</Form.Label>
                    <Form.Control
                        type="text"
                        name="collectionId"
                        value={product.collectionId}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formDesignerId">
                    <Form.Label>ID дизайнера</Form.Label>
                    <Form.Control
                        type="text"
                        name="designerId"
                        value={product.designerId}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group controlId="formImage">
                    <Form.Label>Изображение</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Обновить
                </Button>
            </Form>
        </div>
    );
};

export default UpdateProductForm;
