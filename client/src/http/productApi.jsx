import { $authHost, $host } from ".";  // Обеспечиваем доступ к авторизованным и неавторизованным хостам

// Создание коллекции
export const createCollection = async (collection) => {
    const { data } = await $authHost.post('api/collection', collection);  // POST-запрос с данными коллекции
    return data;
}

// Получение коллекции
export const fetchCollection = async () => {
    const { data } = await $host.get('api/collection');  // GET-запрос на получение коллекции
    return data;
}

// Создание дизайнера
export const createDesigner = async (designer) => {
    const { data } = await $authHost.post('api/designer', designer);  // POST-запрос с данными дизайнера
    return data;
}

// Получение дизайнеров
export const fetchDesigner = async () => {
    const { data } = await $host.get('api/designer');  // GET-запрос на получение дизайнеров
    return data;
}

// Создание продукта
export const createProduct = async (product) => {
    const { data } = await $authHost.post('api/products', product);  // POST-запрос с данными продукта
    return data;
}

// Получение списка продуктов с фильтрацией и пагинацией
export const fetchProduct = async (collectionId, designerId, page, limit = 5, sortByPrice) => {
    const { data } = await $host.get('api/products', {
        params: {
            collectionId,  // Передаем collectionId
            designerId,    // Передаем designerId
            page,           // Пагинация
            limit,          // Лимит на количество товаров на страницу
            sortByPrice     // Фильтрация по цене (если нужно)
        }
    });
    return data;
};

// Получение одного продукта по ID
export const fetchOneProduct = async (id) => {
    const {data} = await $host.get('api/products/'+id)
    return data
};


export const getProducts = async (filters = {}) => {
    const { designerId, collectionId, sortByPrice, limit = 20, page = 1 } = filters;

    const { data } = await $host.get('/api/products', {
        params: {
            designerId,
            collectionId,
            sortByPrice,
            limit,
            page
        }
    });

    return data;
};


export const appendProduct = async (productId, quantity) => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    const { data } = await $authHost.post(
        `api/basket/product/${productId}/append`, // Убедитесь, что путь правильный
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
};


// Получение продукта по ID
export const getProductById = async (id) => {
    const { data } = await $host.get(`/api/products/${id}`);
    return data;
};

// Удаление продукта
export const deleteProduct = async (id) => {
    const { data } = await $authHost.delete(`/api/products/${id}`);
    return data;
};

// Обновление данных продукта
export const updateProduct = async (id, productData) => {
    try {
        const { data } = await $authHost.put(`/api/products/${id}`, productData);
        return data;
    } catch (error) {
        console.error("Ошибка при обновлении продукта:", error);
        throw error;
    }
};

