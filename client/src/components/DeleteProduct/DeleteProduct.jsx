import React from 'react';
import { Button, Modal } from 'react-bootstrap'; 
import { useState } from 'react';
import { deleteProduct } from '../../http/productApi'; // Импортируем API для удаления продукта

const DeleteProductButton = ({ productId, onDeleteSuccess }) => {
    const [show, setShow] = useState(false); // Для управления модальным окном

    const handleClose = () => setShow(false); // Закрытие модального окна
    const handleShow = () => setShow(true); // Открытие модального окна

    const handleDelete = async () => {
        try {
            await deleteProduct(productId); // Вызываем API для удаления продукта
            onDeleteSuccess(); // Уведомляем родительский компонент об успешном удалении
            handleClose(); // Закрываем окно
        } catch (error) {
            console.error("Ошибка при удалении продукта:", error);
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Удалить продукт
            </Button>

            {/* Модальное окно подтверждения удаления */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить этот продукт?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteProductButton;
