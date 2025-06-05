import { $authHost, $host } from ".";
import { jwtDecode } from 'jwt-decode';

export const registration = async (email, password) => {
    const { data } = await $host.post('api/user/registration', { email, password, role: "user" });
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.id)
    return jwtDecode(data.token);
};

export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('id', data.id)
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
};

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth');
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token);
};

// Fetch all users
export const fetchAllUsers = async () => {
    try {
        const { data } = await $authHost.get('/api/user'); // Используйте правильный путь к вашему API
        console.log("Ответ от API:", data); // Лог ответа от сервера
        return data; // Данные передаются в компонент
    } catch (error) {
        console.error("Ошибка при запросе всех пользователей:", error);
        throw error;
    }
};

// Fetch user by ID
export const fetchUserById = async (id) => {
    const { data } = await $authHost.get(`api/user/${id}`);
    return data; // Returns the user data
};

// Update user details
export const updateUser = async (id, updatedData) => {
    const { data } = await $authHost.put(`api/user/${id}`, updatedData);
    return data; // Returns the updated user data
};

// Delete user
export const deleteUser = async (id) => {
    const { data } = await $authHost.delete(`api/user/${id}`);
    return data; // Returns confirmation of deletion
};
