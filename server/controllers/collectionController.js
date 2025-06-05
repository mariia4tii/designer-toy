const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Подключение к базе данных
const ApiError = require('../error/ApiError'); // Для обработки ошибок


class CollectionController {
async getAllCollection(req, res) {
    const showAllcollectionQuery = `
       SELECT id, name, created_at, updated_at FROM collections;

    `
    const collection = await pool.query(showAllcollectionQuery)
    return res.json(collection.rows)
}

async getCollectionById(req,res){
    const { id } = req.params;
    try {
    const showIDcollectionQuery =`SELECT id, name, created_at, updated_at FROM collections WHERE id = $1`
    const collection = await pool.query(showIDcollectionQuery,[id])
       if (collection.rows.length === 0) {
            return next(ApiError.notFound("Коллекция не найден"));
        }
        return res.json(collection.rows)
   }   catch (error) {
   console.error(error);
   return next(ApiError.internal("Ошибка сервера при получении коллекции"));
}
}
 
async deleteCollection(req,res){
    const { id } = req.params;
    try {
        const query = 'DELETE FROM collections WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return next(ApiError.notFound("Коллекция не найден"));
        }

        return res.json({ message: "Дизайнер удален" });
    } catch (error) {
        console.error(error);
        return next(ApiError.internal("Ошибка сервера при удалении дизайнера"));
    }
}

async postСollection(req, res, next) {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ error: "Поле name обязательно для добавления коллекции" });
        }

        const query = `
            INSERT INTO collections (name, created_at, updated_at)
            VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, name, created_at, updated_at
        `;

        const result = await pool.query(query, [name]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return next(ApiError.internal("Ошибка сервера при добавлении коллекции"));
    }
}

//поправить!!!!!
async updateCollection(req, res, next) {
    const { id } = req.params; // ID дизайнера для обновления
    const { name } = req.body; // Новое имя дизайнера

    try {
        // Проверяем, передано ли имя
        if (!name) {
            return res.status(400).json({ error: "Поле name обязательно для обновления" });
        }

        // SQL-запрос для обновления дизайнера
        const query = `
            UPDATE collections
            SET name = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id, name, created_at, updated_at
        `;

        // Выполняем запрос
        const result = await pool.query(query, [name, id]);

        // Проверяем, найден ли дизайнер с указанным ID
        if (result.rows.length === 0) {
            return next(ApiError.notFound("Коллекция не найден"));
        }

        // Возвращаем обновленные данные
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return next(ApiError.internal("Ошибка сервера при обновлении коллекции"));
    }
}

}

module.exports = new CollectionController();
