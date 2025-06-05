const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Подключение к базе данных
const ApiError = require('../error/ApiError'); // Для обработки ошибок

// Функция для генерации JWT токена
const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role }, 
        process.env.JWT_SECRET, // Секретный ключ из переменной окружения
        { expiresIn: '24h' } // Время действия токена
    );
}

class UserController {
    // Регистрация пользователя
    async registration(req, res, next) {
        const { email, password, role } = req.body;
    
        if (!email || !password) {
            return next(ApiError.badRequest("Некорректный email или пароль"));
        }
    
        try {
            console.log(`Checking if user exists with email: ${email}`);
            const checkQuery = 'SELECT * FROM users WHERE email = $1';
            const result = await pool.query(checkQuery, [email]);
    
            if (result.rows.length > 0) {
                return next(ApiError.badRequest("Пользователь с таким email уже существует"));
            }
    
            console.log('User not found, proceeding with registration');
            const hashedPassword = await bcrypt.hash(password, 10);
    
            console.log('Inserting new user into the database');
            const insertQuery = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role';
            const insertResult = await pool.query(insertQuery, [email, hashedPassword, role || 'user']);
    
            const user = insertResult.rows[0];
    
            // Генерация JWT
            console.log('Generating JWT for the user');
            const token = generateJwt(user.id, user.email, user.role);
            console.log(user_id, typeof user_id)
            res.status(201).json({ token });
        } catch (error) {
            console.error('Error during registration:', error);
            return next(ApiError.internal("Ошибка сервера при регистрации"));
        }
    }
    

    // Вход пользователя
    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            // Поиск пользователя по email
            const checkQuery = 'SELECT id, email, password, role FROM users WHERE email = $1';
            const result = await pool.query(checkQuery, [email]);

            if (result.rows.length === 0) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            const user = result.rows[0];

            // Проверка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return next(ApiError.badRequest("Неверный пароль"));
            }

            // Генерация JWT токена
            const token = generateJwt(user.id, user.email, user.role);
            console.log(user.id, typeof user.id)
            res.status(200).json({ token, id: user.id }); // Ответ с токеном
        } catch (error) {
            console.error(error);
            return next(ApiError.internal("Ошибка сервера при входе"));
        }
    }

    // Проверка токена (для защищённых маршрутов)
   // Проверка авторизации
   async check(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
        if (!token) {
            return next(ApiError.unauthorized('Токен не предоставлен'));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(ApiError.unauthorized('Неверный токен'));
            }

            res.json({ message: 'Токен валиден', user: decoded });
        });
    } catch (error) {
        console.error(error);
        return next(ApiError.internal('Ошибка при проверке токена'));
    }
}

    // Получение всех пользователей
    async getAllUsers(req, res) {
        const showAllusersQuery = `
           SELECT id, email, password, role, created_at FROM users;

        `
        const users = await pool.query(showAllusersQuery)
        return res.json(users.rows)
    }

    async getUserById(req,res){
        const { id } = req.params;
        try {
        const showIDusersQuery =`SELECT id, email, role, created_at FROM users WHERE id = $1`
        const users = await pool.query(showIDusersQuery,[id])
           if (users.rows.length === 0) {
                return next(ApiError.notFound("Пользователь не найден"));
            }
            return res.json(users.rows)
       }   catch (error) {
       console.error(error);
       return next(ApiError.internal("Ошибка сервера при получении пользователя"));
    }
    }
     
    async deleteUser(req,res){
        const { id } = req.params;
        try {
            const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
            const result = await pool.query(query, [id]);

            if (result.rows.length === 0) {
                return next(ApiError.notFound("Пользователь не найден"));
            }

            return res.json({ message: "Пользователь удален" });
        } catch (error) {
            console.error(error);
            return next(ApiError.internal("Ошибка сервера при удалении пользователя"));
        }
    }
   
    // Обновление данных пользователя (только для админа)
    async updateUser(req, res) {
        
        const { id } = req.params;
        const { email, password, role } = req.body;

        try {
            // Хеширование нового пароля, если он указан
            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10); // Можно поставить меньший cost
            }

            // Используем COALESCE для обновления только изменённых полей
            const query = `
            UPDATE users 
            SET email = COALESCE($1, email), 
                password = COALESCE($2, password), 
                role = COALESCE($3, role) 
            WHERE id = $4 
            RETURNING id, email, role
            `;
            const result = await pool.query(query, [email, hashedPassword || password, role, id]);

            if (result.rows.length === 0) {
                return next(ApiError.notFound("Пользователь не найден"));
            }

            res.status(200).json(query.rows);
        } catch (error) {
            console.error(error);
            return next(ApiError.internal("Ошибка сервера при обновлении пользователя"));
        }
    }
}
module.exports = new UserController();
