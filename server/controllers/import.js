const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csvParser = require('csv-parser');
const pool = require('../db'); 

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// SQL-запрос для вставки данных
const query = `INSERT INTO public.orders (user_id, total_amount, status, created_at) 
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (id) DO NOTHING;`;  // id не указываем, так как оно будет автоинкрементироваться

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Файл не найден!');
    }

    const filePath = req.file.path;

    const stream = fs.createReadStream(filePath).pipe(csvParser({ separator: ';' }));

    stream.on('data', async (row) => {
        try {
            // Разбираем данные строки
            const userId = parseInt(row.user_id, 10);
            const totalAmount = parseFloat(row.total_amount);
            const status = row.status || 'В обработке';
            const createdAt = row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString();

            // Проверяем, что числовые значения корректны
            if (isNaN(userId) || isNaN(totalAmount)) {
                console.error('Ошибка: некорректные данные в строке:', row);
                return; // Пропускаем некорректную строку
            }

            // Готовим значения для вставки
            const values = [userId, totalAmount, status, createdAt];

            // Выполняем запрос для вставки данных в БД
            await pool.query(query, values);
        } catch (err) {
            console.error('Ошибка импорта строки:', err);
        }
    });

    // Когда обработка файла завершена
   // В файле импорта (например, импорт.js)
stream.on('end', () => {
    fs.unlinkSync(filePath); // Удаляем временный файл
    res.json({ message: 'Данные успешно импортированы!' }); // Отправляем успешный ответ в формате JSON
});


    // Если возникла ошибка при чтении файла
    stream.on('error', (err) => {
        console.error('Ошибка при чтении файла:', err);
        res.status(500).send('Ошибка обработки файла');
    });
});

module.exports = router;
