const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Подключение к базе данных
const ApiError = require('../error/ApiError'); 
const uuid = require('uuid'); 
const path = require('path'); // Импортируем библиотеку uuid
// Для обработки ошибок

// Функция для генерации JWT токеына
const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role }, 
        process.env.JWT_SECRET, // Секретный ключ из переменной окружения
        { expiresIn: '24h' } // Время действия токена
    );
}

class ProductController {


async create(req, res, next) {
        try {
            // Извлекаем данные из тела запроса
            const { name, description, price, stock, collection_id, designer_id } = req.body;
            const { image } = req.files; // Понимаем, что загружается файл изображения
        
            // Логирование входящих данных
            console.log('Запрос пришел с данными: ', { name, description, price, stock, collection_id, designer_id });
            console.log('Получен файл изображения: ', image);
        
            // Проверка наличия изображения
            if (!image) {
                return next(ApiError.badRequest('Нет файла изображения'));
            }
        
            // Генерация уникального имени для файла изображения
            const fileName = uuid.v4() + ".jpg";
        
            // Логирование пути для сохранения файла
            console.log('Файл будет сохранен как: ', fileName);
        
            // Перемещаем файл изображения в папку `static`
            image.mv(path.resolve(__dirname, "..", "static", fileName), async (err) => {

                if (err) {
                    console.error('Ошибка при перемещении файла: ', err);
                    return next(ApiError.badRequest("Ошибка при сохранении изображения"));
                }
        
                // Строим SQL запрос для добавления нового продукта
                const query = `
                    INSERT INTO public.products (name, description, price, stock, collection_id, designer_id, image_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *;
                `;
        
                // Подготавливаем значения для запроса
                const values = [
                    name,
                    description || null,
                    price,
                    stock || 0,  // Если stock не передан, ставим 0
                    collection_id || null,  // Если collection_id не передан, ставим null
                    designer_id || null,  // Если designer_id не передан, ставим null
                    fileName,  // Путь к изображению
                ];
        
                // Выполняем запрос
                const result = await pool.query(query, values);
        
                // Логирование успешного создания продукта
                console.log('Продукт успешно добавлен: ', result.rows[0]);
        
                // Отправляем ответ с добавленным продуктом
                return res.json(result.rows[0]);
            });
        
        } catch (e) {
            console.error('Ошибка при добавлении товара: ', e);
            next(ApiError.badRequest(e.message));  // Перехватываем ошибку и отправляем ее клиенту
        }
        
}

async getAll(req, res) {
    const { 
        designerId, // ID дизайнера для фильтрации
        collectionId, // ID коллекции для фильтрации
        sortByPrice, // Фильтр сортировки по цене ("asc" или "desc")
        limit = 20, // Лимит записей
        page = 1 // Номер страницы
    } = req.query;

    const offset = (page - 1) * limit; // Вычисляем смещение
    const params = []; // Параметры для подстановки в запрос
    let query = `
        SELECT products.*, designers.name AS designer_name, collections.name AS collection_name
        FROM products
        LEFT JOIN designers ON products.designer_id = designers.id
        LEFT JOIN collections ON products.collection_id = collections.id
    `; // Базовый запрос с джойнами
    let conditions = []; // Условия для фильтрации

    // Фильтр по ID дизайнера
    if (designerId) {
        conditions.push(`products.designer_id = $${params.length + 1}`);
        params.push(designerId);
    }

    // Фильтр по ID коллекции
    if (collectionId) {
        conditions.push(`products.collection_id = $${params.length + 1}`);
        params.push(collectionId);
    }

    // Добавляем условия фильтрации в запрос
    if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
    }

    // Сортировка по цене
    if (sortByPrice === 'asc') {
        query += ` ORDER BY products.price ASC`;
    } else if (sortByPrice === 'desc') {
        query += ` ORDER BY products.price DESC`;
    }

    // Добавляем лимит и смещение
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    try {
        // Выполняем запрос
        const result = await pool.query(query, params);

        // Подсчитываем общее количество записей
        const countQuery = `
            SELECT COUNT(*) FROM products
            LEFT JOIN designers ON products.designer_id = designers.id
            LEFT JOIN collections ON products.collection_id = collections.id
        ` + (conditions.length > 0 ? ` WHERE ` + conditions.join(' AND ') : '');

        const totalCount = await pool.query(countQuery, params.slice(0, params.length - 2));

        return res.json({
            count: totalCount.rows[0].count, // Общее количество записей
            rows: result.rows, // Отфильтрованные записи
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при получении списка продуктов' });
    }
}
async getProductById(req, res, next) {
    const { id } = req.params;
    try {
        const showIDusersQuery = `SELECT * FROM products WHERE id = $1`;
        const products = await pool.query(showIDusersQuery, [id]);

        if (products.rows.length === 0) {
            return next(ApiError.notFound("товар не найден"));
        }

        const product = products.rows[0];

        // Переименуем и сформируем полный путь для image_url
        if (product.image_url) {
            product.image_url = `${process.env.REACT_APP_API_URL}/static/${product.image_url}`;
        }

        return res.json(product); // Убедитесь, что возвращаете объект, а не массив
    } catch (error) {
        console.error(error);
        return next(ApiError.internal("Ошибка сервера при получении товара"));
    }
}


async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return next(ApiError.notFound("Товар не найден")); // Использование next
        }

        return res.json({ message: "Товар удален" });
    } catch (error) {
        console.error(error);
        return next(ApiError.internal("Ошибка сервера при удалении товара")); // Использование next
    }
}


// Обновление данных пользователя (только для админа)
async updateProduct(req, res, next) {
    const { id } = req.params; // Получаем id продукта из параметров маршрута
    const { name, description, price, stock, collection_id, designer_id, image_url } = req.body; // Данные для обновления

    try {
        // Запрос для обновления только тех полей, которые указаны
        const query = `
            UPDATE products
            SET 
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                stock = COALESCE($4, stock),
                collection_id = COALESCE($5, collection_id),
                designer_id = COALESCE($6, designer_id),
                image_url = COALESCE($7, image_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING id, name, description, price, stock, collection_id, designer_id, image_url, updated_at
        `;

        // Выполняем запрос к базе данных
        const result = await pool.query(query, [
            name,
            description,
            price,
            stock,
            collection_id,
            designer_id,
            image_url,
            id,
        ]);

        // Проверяем, был ли продукт найден и обновлен
        if (result.rows.length === 0) {
            return next(ApiError.notFound("Продукт не найден"));
        }

        // Возвращаем обновлённый продукт
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return next(ApiError.internal("Ошибка сервера при обновлении продукта"));
    }
}



}
module.exports = new ProductController();