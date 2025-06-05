// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка Authorization

    if (!token) {
        return res.status(403).json({ error: 'Нет авторизации' });
    }

    try {
        // Проверка и декодирование токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Добавляем информацию о пользователе в запрос
        console.log("Decoded user:", req.user); 
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Неверный или просроченный токен' });
    }
};