import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { createDesigner, fetchAllDesigners, updateDesigner, deleteDesigner } from '../../http/designerApi'; 

const Designers = () => {
    const [designers, setDesigners] = useState([]); // Список дизайнеров
    const [showModal, setShowModal] = useState(false); // Окно для создания/редактирования дизайнера
    const [selectedDesigner, setSelectedDesigner] = useState(null); // Выбранный дизайнер для редактирования
    const [designerName, setDesignerName] = useState(''); // Имя дизайнера

    // Загружаем всех дизайнеров при монтировании компонента
    useEffect(() => {
        fetchDesigners();
    }, []);

    // Функция для получения всех дизайнеров
    const fetchDesigners = async () => {
        try {
            const designersData = await fetchAllDesigners();
            setDesigners(designersData);
        } catch (error) {
            console.error('Ошибка при загрузке дизайнеров:', error);
        }
    };

    // Открытие модального окна для создания/редактирования дизайнера
    const handleCreateOrUpdate = () => {
        if (selectedDesigner) {
            // Обновляем существующего дизайнера
            updateDesignerDetails(selectedDesigner.id);
        } else {
            // Создаем нового дизайнера
            createNewDesigner();
        }
    };

    // Функция для создания нового дизайнера
    const createNewDesigner = async () => {
        try {
            const newDesigner = await createDesigner(designerName);
            setDesigners([...designers, newDesigner]); // Добавляем нового дизайнера в список
            setShowModal(false); // Закрываем модальное окно
        } catch (error) {
            console.error('Ошибка при создании дизайнера:', error);
        }
    };

    // Функция для обновления дизайнера
    const updateDesignerDetails = async (id) => {
        try {
            const updatedDesigner = await updateDesigner(id, { name: designerName });
            setDesigners(designers.map(designer => designer.id === id ? updatedDesigner : designer)); // Обновляем данные дизайнера
            setShowModal(false); // Закрываем модальное окно
        } catch (error) {
            console.error('Ошибка при обновлении дизайнера:', error);
        }
    };

    // Функция для удаления дизайнера
    const removeDesigner = async (id) => {
        try {
            await deleteDesigner(id);
            setDesigners(designers.filter(designer => designer.id !== id)); // Убираем удаленного дизайнера из списка
        } catch (error) {
            console.error('Ошибка при удалении дизайнера:', error);
        }
    };

    // Открытие модального окна для редактирования дизайнера
    const openModalForEdit = (designer) => {
        setSelectedDesigner(designer);
        setDesignerName(designer.name); // Заполняем форму данными текущего дизайнера
        setShowModal(true);
    };

    // Открытие модального окна для добавления нового дизайнера
    const openModalForCreate = () => {
        setSelectedDesigner(null); // Убираем выбранного дизайнера
        setDesignerName(''); // Очищаем поле ввода
        setShowModal(true);
    };

    return (
        <div>
            <h1>Дизайнеры</h1>
            <Button variant="primary" onClick={openModalForCreate}>Добавить дизайнера</Button>
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Дата создания</th>
                        <th>Дата обновления</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {designers.map(designer => (
                        <tr key={designer.id}>
                            <td>{designer.id}</td>
                            <td>{designer.name}</td>
                            <td>{designer.created_at}</td>
                            <td>{designer.updated_at}</td>
                            <td>
                                <Button variant="info" onClick={() => openModalForEdit(designer)}>Редактировать</Button>
                                <Button variant="danger" onClick={() => removeDesigner(designer.id)}>Удалить</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Модальное окно для создания/редактирования дизайнера */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedDesigner ? 'Редактировать дизайнера' : 'Добавить дизайнера'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="designerName">
                            <Form.Label>Имя дизайнера</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите имя дизайнера"
                                value={designerName}
                                onChange={(e) => setDesignerName(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleCreateOrUpdate}>
                            {selectedDesigner ? 'Обновить' : 'Добавить'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Designers;
