import { $authHost} from "."; // Импортируем базовые хосты для запросов

// Функция для создания нового дизайнера
export const createDesigner = async (name) => {
    const { data } = await $authHost.post('api/designer', { name });
    return data; // Возвращаем данные о созданном дизайнере
};

// Функция для получения всех дизайнеров
export const fetchAllDesigners = async () => {
    try {
        const { data } = await $authHost.get('api/designer');
        return data; // Возвращаем все дизайнеры
    } catch (error) {
        console.error("Ошибка при загрузке дизайнеров:", error);
        throw error;
    }
};

// Функция для получения дизайнера по ID
export const fetchDesignerById = async (id) => {
    const { data } = await $authHost.get(`api/designer/${id}`);
    return data; // Возвращаем данные о дизайнере
};

// Функция для обновления данных дизайнера
export const updateDesigner = async (id, updatedData) => {
    const { data } = await $authHost.put(`api/designer/${id}`, updatedData);
    return data; // Возвращаем обновленные данные о дизайнере
};

// Функция для удаления дизайнера
export const deleteDesigner = async (id) => {
    const { data } = await $authHost.delete(`api/designer/${id}`);
    return data; // Возвращаем подтверждение удаления
};
