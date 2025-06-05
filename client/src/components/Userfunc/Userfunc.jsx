import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { fetchAllUsers, updateUser, deleteUser,registration } from '../../http/userAPI'; // Убедитесь, что путь к API-файлу указан верно

const Userfunc = () => {
    const [users, setUsers] = useState([]); // Список всех пользователей
    const [showUserModal, setShowUserModal] = useState(false); // Состояние для отображения модального окна
    const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь (для редактирования)
    const [newUserData, setNewUserData] = useState({ email: '', password: '', role: 'user' }); // Данные нового/редактируемого пользователя

    // Загрузка всех пользователей при монтировании компонента
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchAllUsers();
                console.log("Загруженные пользователи:", data); // Лог данных в компоненте
                setUsers(data); // Устанавливаем состояние
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
            }
        };
        loadUsers();
    }, []);

    // Открытие модального окна для обновления пользователя
    const handleUpdateUser = (user) => {
        setSelectedUser(user); // Устанавливаем выбранного пользователя
        setNewUserData({ email: user.email, password: '', role: user.role }); // Заполняем данные для редактирования
        setShowUserModal(true); // Показываем модальное окно
    };

    // Обработка создания или обновления пользователя
    const handleCreateOrUpdateUser = async () => {
        try {
            const { email, password, role } = newUserData;
    
            if (selectedUser) {
                // Если пользователь выбран, обновляем его данные
                const updatedUser = await updateUser(selectedUser.id, { email, password, role });
                setUsers(users.map(user => user.id === selectedUser.id ? updatedUser : user)); // Обновляем пользователя в списке
            } else {
                // Создание нового пользователя
                const newUser = await registration(email, password, role);
                setUsers([...users, newUser]); // Добавляем нового пользователя в список
            }
    
            setShowUserModal(false); // Закрываем модальное окно
        } catch (error) {
            console.error("Ошибка при обновлении/создании пользователя:", error);
        }
    };
    

    // Удаление пользователя
    const handleDeleteUser = async (id) => {
        try {
            await deleteUser(id); // Удаляем пользователя
            setUsers(users.filter(user => user.id !== id)); // Убираем его из локального списка
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
        }
    };

    return (
        <div>
            <h1>Админ Панель</h1>

            {/* Таблица пользователей */}
            <h2>Пользователи</h2>
            <Button onClick={() => {
                setSelectedUser(null); // Сбрасываем выбранного пользователя
                setNewUserData({ email: '', password: '', role: 'user' }); // Очищаем данные формы
                setShowUserModal(true); // Открываем модальное окно
            }}>
                Создать пользователя
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleUpdateUser(user)}>Редактировать</Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Удалить</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Модальное окно для создания/обновления пользователя */}
            <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? 'Обновить пользователя' : 'Создать пользователя'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Введите email"
                                value={newUserData.email}
                                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={newUserData.password}
                                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formRole">
                            <Form.Label>Роль</Form.Label>
                            <Form.Control
                                as="select"
                                value={newUserData.role}
                                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                            >
                                <option value="user">Пользователь</option>
                                <option value="admin">Администратор</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" onClick={handleCreateOrUpdateUser}>
                            {selectedUser ? 'Обновить пользователя' : 'Создать пользователя'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Userfunc;
