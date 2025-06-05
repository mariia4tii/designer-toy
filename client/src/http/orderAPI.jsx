import { $authHost } from "."; // Если нужен токен, иначе используйте $host

// Получение всех заказов
export const fetchAllOrders = async () => {
    const { data } = await $authHost.get('/api/order/all');
    return data;
};

// Обновление статуса заказа
export const updateOrderStatus = async (orderId, status) => {
    const { data } = await $authHost.put('/api/order/status', { orderId, status });
    return data;
};
