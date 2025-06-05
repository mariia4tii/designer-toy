import { observer } from "mobx-react-lite";
import React, { useContext, useState, useEffect } from "react";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { Context } from "../..";
import { fetchCollection, fetchDesigner, createProduct } from "../../http/productApi"; // Обновить импорт

const CreateProduct = observer(({ show, onHide }) => {
  const { product } = useContext(Context);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0); // Для количества на складе
  const [file, setFile] = useState(null);

  // Загружаем коллекции и дизайнеров при первом рендере
  useEffect(() => {
    fetchCollection().then((data) => product.setCollection(data));
    fetchDesigner().then((data) => product.setDesigner(data));
  }, [product]);

  // Обработчик выбора файла
  const selectFile = e => {
    setFile(e.target.files[0])
}

  // Обработчик добавления продукта
  const addProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("collection_id", product.selectedCollection.id || null);
      formData.append("designer_id", product.selectedDesigner.id || null);
      formData.append("image", file); // Убедитесь, что файл выбран
  
      const response = await createProduct(formData); // Отправка запроса на сервер
      console.log("Продукт добавлен:", response);
       // Логируем содержимое req.files

      // Сбрасываем форму и закрываем модальное окно
      setName("");
      setPrice(0);
      setDescription("");
      setStock(0);
      setFile(null);
      product.setSelectedCollection({});
      product.setSelectedDesigner({});
      onHide(); // Закрытие модального окна
    } catch (e) {
      console.error("Ошибка при добавлении продукта:", e);
    }
  };
  

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить новый товар
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Выбор коллекции */}
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {product.selectedCollection.name || "Выберите коллекцию"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {product.collection.map((collection) => (
                <Dropdown.Item
                  onClick={() => product.setSelectedCollection(collection)}
                  key={collection.id}
                >
                  {collection.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Выбор дизайнера */}
          <Dropdown className="mt-2 mb-2">
            <Dropdown.Toggle>
              {product.selectedDesigner.name || "Выберите дизайнера"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {product.designer.map((designer) => (
                <Dropdown.Item
                  onClick={() => product.setSelectedDesigner(designer)}
                  key={designer.id}
                >
                  {designer.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* Название товара */}
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3"
            placeholder="Введите название товара"
          />

          {/* Стоимость товара */}
          <Form.Control
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-3"
            placeholder="Введите стоимость товара"
            type="number"
          />

          {/* Количество на складе */}
          <Form.Control
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="mt-3"
            placeholder="Введите количество на складе"
            type="number"
          />

          {/* Файл изображения */}
          <Form.Control className="mt-3" 
          type="file" 
          onChange={selectFile} />

          {/* Описание товара */}
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-3"
            placeholder="Введите описание товара"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={"outline-danger"} onClick={onHide}>
          Закрыть
        </Button>
        <Button variant={"outline-success"} onClick={addProduct}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateProduct;
