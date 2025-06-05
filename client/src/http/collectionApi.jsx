import { $authHost} from ".";

// Fetch all collections
export const fetchAllCollections = async () => {
    try {
        const { data } = await $authHost.get('/api/collection');
        return data; // Возвращаем все коллекции
    } catch (error) {
        console.error("Ошибка при загрузке коллекций:", error);
        throw error;
    }
};

// Fetch collection by ID
export const fetchCollectionById = async (id) => {
    try {
        const { data } = await $authHost.get(`/api/collection/${id}`);
        return data; // Возвращаем коллекцию по ID
    } catch (error) {
        console.error("Ошибка при загрузке коллекции по ID:", error);
        throw error;
    }
};

// Create a new collection
export const createCollection = async (name) => {
    try {
        const { data } = await $authHost.post('/api/collection', { name });
        return data; // Возвращаем созданную коллекцию
    } catch (error) {
        console.error("Ошибка при создании коллекции:", error);
        throw error;
    }
};

// Update collection
export const updateCollection = async (id, name) => {
    try {
        const { data } = await $authHost.put(`/api/collection/${id}`, { name });
        return data; // Возвращаем обновленную коллекцию
    } catch (error) {
        console.error("Ошибка при обновлении коллекции:", error);
        throw error;
    }
};

// Delete collection
export const deleteCollection = async (id) => {
    try {
        const { data } = await $authHost.delete(`/api/collection/${id}`);
        return data; // Возвращаем подтверждение удаления
    } catch (error) {
        console.error("Ошибка при удалении коллекции:", error);
        throw error;
    }
};
