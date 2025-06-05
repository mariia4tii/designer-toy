import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { fetchAllCollections, createCollection, updateCollection, deleteCollection } from '../../http/collectionApi';

const CollectionList = () => {
    const [collections, setCollections] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [collectionName, setCollectionName] = useState('');

    useEffect(() => {
        // Загружаем все коллекции при монтировании компонента
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const data = await fetchAllCollections();
            setCollections(data); // Обновляем состояние коллекциями
        } catch (error) {
            console.error('Ошибка при загрузке коллекций:', error);
        }
    };

    const handleCreateOrUpdate = async () => {
        if (selectedCollection) {
            // Обновляем существующую коллекцию
            await updateExistingCollection(selectedCollection.id);
        } else {
            // Создаем новую коллекцию
            await createNewCollection();
        }
    };

    const createNewCollection = async () => {
        try {
            const newCollection = await createCollection(collectionName);
            setCollections([...collections, newCollection]); // Добавляем коллекцию в список
            setShowModal(false);
        } catch (error) {
            console.error('Ошибка при создании коллекции:', error);
        }
    };

    const updateExistingCollection = async (id) => {
        try {
            const updatedCollection = await updateCollection(id, collectionName);
            setCollections(collections.map(collection => collection.id === id ? updatedCollection : collection)); // Обновляем коллекцию в списке
            setShowModal(false);
        } catch (error) {
            console.error('Ошибка при обновлении коллекции:', error);
        }
    };

    const openModalForEdit = (collection) => {
        setSelectedCollection(collection);
        setCollectionName(collection.name);
        setShowModal(true);
    };

    const openModalForCreate = () => {
        setSelectedCollection(null);
        setCollectionName('');
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCollection(id);
            setCollections(collections.filter(collection => collection.id !== id)); // Удаляем коллекцию из списка
        } catch (error) {
            console.error('Ошибка при удалении коллекции:', error);
        }
    };

    return (
        <div>
            <h1>Коллекции</h1>
            <Button variant="primary" onClick={openModalForCreate}>Добавить коллекцию</Button>
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
                    {collections.map(collection => (
                        <tr key={collection.id}>
                            <td>{collection.id}</td>
                            <td>{collection.name}</td>
                            <td>{collection.created_at}</td>
                            <td>{collection.updated_at}</td>
                            <td>
                                <Button variant="info" onClick={() => openModalForEdit(collection)}>Редактировать</Button>
                                <Button variant="danger" onClick={() => handleDelete(collection.id)}>Удалить</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Модальное окно для добавления/редактирования коллекции */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCollection ? 'Редактировать коллекцию' : 'Добавить коллекцию'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="collectionName">
                            <Form.Label>Имя коллекции</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите имя коллекции"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleCreateOrUpdate}>
                            {selectedCollection ? 'Обновить' : 'Добавить'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CollectionList;
