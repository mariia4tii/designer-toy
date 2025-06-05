import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { fetchAllOrders, updateOrderStatus } from '../../http/orderAPI'; // Убедись, что путь корректный

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('в обработке');

    const loadOrders = async () => {
        try {
            const data = await fetchAllOrders();
            console.log('Загруженные заказы:', data);
            setOrders(data);
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowModal(true);
    };

    const handleStatusUpdate = async () => {
        try {
            await updateOrderStatus(selectedOrder.id, newStatus);
            setShowModal(false);
            loadOrders(); // Перезагружаем данные
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Управление заказами</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клиент</th>
                        <th>Адрес</th>
                        <th>Телефон</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.address}</td>
                            <td>{order.phone}</td>
                            <td>{new Date(order.created_at).toLocaleString()}</td>
                            <td>{order.status}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleEditClick(order)}>
                                    Изменить статус
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Модалка изменения статуса */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить статус заказа #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Статус</Form.Label>
                            <Form.Control
                                as="select"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="в обработке">в обработке</option>
                                <option value="доставлен">доставлен</option>
                                <option value="отменён">отменён</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Отмена</Button>
                    <Button variant="primary" onClick={handleStatusUpdate}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminOrders;
