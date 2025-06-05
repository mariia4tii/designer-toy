import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap"; // Для оформления
import { observer } from "mobx-react-lite";
import DeleteProductButton from "../DeleteProduct/DeleteProduct"; // Удаление продукта
import UpdateProductForm from "../UpdateProduct/UpdateProduct";
import CreateProduct from "../Modal/CreateProduct"; // Добавление нового продукта
import { fetchProduct } from "../../http/productApi"; // API для получения продуктов
import Product from "../ProductList/ProductList";


const Productfunc = observer(() => {
  const [showCreateModal, setShowCreateModal] = useState(false); // Состояние для отображения модального окна создания продукта
  const [products, setProducts] = useState([]); // Состояние для хранения списка продуктов
  const [selectedProductId, setSelectedProductId] = useState(null); // Состояние для хранения выбранного продукта

  useEffect(() => {
    // Загружаем список продуктов при старте приложения
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await fetchProduct(); // Получаем список продуктов с сервера
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteSuccess = () => {
    // Обновляем список продуктов после удаления
    setProducts((prevProducts) => prevProducts.filter(product => product.id !== selectedProductId));
    setSelectedProductId(null); // Сбрасываем выбранный продукт
  };

  return (
        <Container>
          <Row>
            <Col md={12}>
              <h1>Управление продуктами</h1>
              {/* Кнопка для открытия модального окна создания продукта */}
              <Button variant="success" onClick={() => setShowCreateModal(true)}>
                Добавить продукт
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {/* Список продуктов, выводится через ProductList */}
              <Product
                products={products}
                onProductClick={(productId) => setSelectedProductId(productId)} // Устанавливаем выбранный продукт
              />
            </Col>
          </Row>
          <Routes>
            {/* Маршрут для обновления продукта */}
            <Route
              path="/products/:id/update"
              element={<UpdateProductForm />}
            />
            {/* Маршрут для удаления продукта */}
            <Route
              path="/products/:id/delete"
              element={
                <DeleteProductButton
                  productId={selectedProductId}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              }
            />
          </Routes>

          {/* Модальное окно для добавления нового продукта */}
          <CreateProduct
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
          />
        </Container>
   );
});

export default Productfunc;
