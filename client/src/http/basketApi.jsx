import { $authHost} from "."; // Импортируем хосты

// Получение текущей корзины для авторизованных пользователей
export const getBasket = async () => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
const { data } = await $authHost.get('api/basket/getone', {
    headers: { Authorization: `Bearer ${token}` }, // Добавляем токен в заголовок
});
return data;

};

// Добавление товара в корзину для авторизованных пользователей
// Добавление товара в корзину для авторизованных пользователей
export const appendProduct = async (productId, quantity) => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    const { data } = await $authHost.post(
        `api/basket/product/${productId}/append`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};






// Увеличение количества товара в корзине для авторизованных пользователей
export const incrementProduct = async (productId, quantity) => {
    const { data } = await $authHost.put(`api/basket/product/${productId}/increment/${quantity}`); // Используем авторизованный хост
    return data;
};

// Уменьшение количества товара в корзине для авторизованных пользователей
export const decrementProduct = async (productId, quantity) => {
    const { data } = await $authHost.put(`api/basket/product/${productId}/decrement/${quantity}`); // Используем авторизованный хост
    return data;
};

// Удаление товара из корзины для авторизованных пользователей
export const removeProduct = async (productId) => {
    const { data } = await $authHost.put(`api/basket/product/${productId}/remove`); // Используем авторизованный хост
    return data;
};

// Очистка корзины для авторизованных пользователей
export const clearBasket = async () => {
    const { data } = await $authHost.put('api/basket/clear'); // Используем авторизованный хост
    return data;
};


