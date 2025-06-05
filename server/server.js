require('dotenv').config(); // Загрузка переменных окружения из .env файла

const express = require('express');
const path = require('path'); 
const cors = require('cors');
const router = require('./routes/index');
const bcrypt = require('bcryptjs');
const pool = require("./db");
const app = express();
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const importRouter = require('./controllers/import');
const exportRouter = require('./controllers/export');
app.use(cookieParser('secret'));
app.use('/import', importRouter);
app.use('/export', exportRouter);

app.use(cors());

app.use(express.json())
app.use('/api',router)
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use(express.json())
app.use('/api',router)
app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); next(); });


app.use('/api',router)

app.use(express.json())






// Функция для инициализации сервера
const start = async () => {
    try {
        // Проверка подключения к базе данных
        await pool.connect();
        console.log('Connected to the database');

        // Здесь можно выполнить любые необходимые действия, такие как синхронизация таблиц, если требуется

        // Запуск сервера
        const PORT = process.env.PORT || 5002; // Порт из переменной окружения или 5000 по умолчанию
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    } catch (e) {
        console.log('Error starting server:', e);
    }
};

// Вызов функции старта
start();
