const pool = require('../db'); // Подключение к базе данных
const AppError = require('../error/ApiError');

const maxAge = 60 * 60 * 1000 * 24 * 365; // Один год (в миллисекундах)
const signed = true;

const BasketController = {
    // Получение корзины или создание новой, если не найдена
    async getOne(req, res, next) {
        try {
            const userId = req.params.userId; // ID пользователя
            let basket;
            // Запрос на получение корзины по userId
            const basketResult = await pool.query(
                'SELECT * FROM basket WHERE user_id = $1',
                [userId]
            );
            if (basketResult.rows.length === 0) {
                // Если корзины нет, отправляем сообщение
                return res.status(404).json({ message: 'Корзина пуста для данного пользователя.' });
            }
    
            // Получаем первую найденную корзину для пользователя
            // basket = basketResult.rows[0];
    
            // Запрашиваем общее количество товаров и сумму корзины
            const summaryResult = await pool.query(
                `SELECT SUM(quantity) AS total_quantity, SUM(price) AS total_sum
                    FROM basket 
                    INNER JOIN basket_product 
                    ON basket_product.basket_id = basket.id
                    INNER JOIN products ON basket_product.product_id = products.id WHERE user_id = $1
                    `,
                [userId]
            );
            
            const { total_quantity, total_sum } = summaryResult.rows[0];
            console.log(total_quantity, total_sum)
            const allBasketResult = await pool.query(
                `SELECT 	
    products.id AS product_id,
    products.name AS product_name, 
    SUM(basket_product.quantity) AS ct, 
    SUM(products.price * basket_product.quantity) AS summary,
    MAX(products.price) AS product_price
FROM basket 
INNER JOIN basket_product ON basket_product.basket_id = basket.id
INNER JOIN products ON basket_product.product_id = products.id 
WHERE user_id = $1
GROUP BY products.id, products.name;


                    `,
                [userId]
            );
            console.log(allBasketResult.rows)
            // Запрашиваем сгруппированные товары с их количеством и суммарной ценой
                
            // Формируем результат с обобщённой информацией
            const response = {
                total_quantity: +total_quantity || 0, // Общее количество товаров
                total_sum: +total_sum || 0,           // Сумма корзины
                products: allBasketResult.rows       // Сгруппированные товары
            };
            console.log(response.total_quantity)
            console.log(response.total_sum)
            // Возвращаем результат в формате JSON
            res.json(response);
        } catch (e) {
            // Обработка ошибок
            next(AppError.badRequest(e.message));
        }
    },
    
    
    
    
   

    // Добавление товара в корзину
    // Добавление товара в корзину
async append(req, res, next) {
    try {
        console.log('helloworls')
        console.log('req.params:', req.params);
        console.log('req.body:', req.body);
        // console.log('req.signedCookies:', req.signedCookies);

        const userId = req.body.userId || req.user.id; // Получаем userId
        console.log(userId)
        if (!userId) {
            throw new Error('User is not authenticated');
        }
        // Проверка и преобразование productId
        const productId = req.params.productId;
        if (!productId || isNaN(productId)) {
            throw new Error(`Invalid productId: ${productId}`);
        }

        const baskedId = await pool.query(
            'INSERT INTO basket (user_id) VALUES ($1) RETURNING id', 
            [userId]
        );
        console.log(baskedId.rows[0].id)
        // Проверяем количество
        const quantity  = req.body.quantity;
        console.log(quantity)
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            throw new Error(`Invalid quantity: ${quantity}`);
        }
        console.log(baskedId.rows[0].id)
        // Проверяем, существует ли товар в корзине
        const result = await pool.query(
            'SELECT * FROM basket_product WHERE basket_id = $1 AND product_id = $2',
            [+baskedId.rows[0].id, +productId]
        );
        console.log(result.rows);

        if (result.rows.length > 0) {
            console.log('hello wprld')
            // Если товар есть, увеличиваем количество
            await pool.query(
                'UPDATE basket_product SET quantity = quantity + $1 WHERE basket_id = $2 AND product_id = $3',
                [quantity, +baskedId, +productId]
            );
        } else {
            // Если товара нет, добавляем его
            await pool.query(
                'INSERT INTO basket_product (basket_id, product_id, quantity) VALUES ($1, $2, $3)',
                [+baskedId.rows[0].id, +productId, quantity]
            );
        }

        res.cookie('basketId', +baskedId, { maxAge, signed });
        res.json({ message: 'Product added to basket' });
    } catch (e) {
        console.error('Error in append:', e.message);
        next(AppError.badRequest(e.message));
    }
},
 
    
    
    

    // Увеличение количества товара в корзине
    async increment(req, res, next) {
        try {
            const basketId = parseInt(req.signedCookies.basketId);
            const { productId } = req.params;
            const { quantity } = req.body;

            if (!productId || !quantity) throw new Error('Product ID and quantity are required.');

            await pool.query(
                'UPDATE basket_product SET quantity = quantity + $1 WHERE basket_id = $2 AND product_id = $3',
                [quantity, basketId, productId]
            );

            res.json({ message: 'Product quantity incremented' });
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    },

    // Уменьшение количества товара в корзине
    async decrement(req, res, next) {
        try {
            const basketId = parseInt(req.signedCookies.basketId);
            const { productId } = req.params;
            const { quantity } = req.body;

            if (!productId || !quantity) throw new Error('Product ID and quantity are required.');

            const result = await pool.query(
                'SELECT quantity FROM basket_product WHERE basket_id = $1 AND product_id = $2',
                [basketId, productId]
            );

            if (result.rows.length > 0) {
                const currentQuantity = result.rows[0].quantity;

                if (currentQuantity > quantity) {
                    await pool.query(
                        'UPDATE basket_product SET quantity = quantity - $1 WHERE basket_id = $2 AND product_id = $3',
                        [quantity, basketId, productId]
                    );
                } else {
                    await pool.query('DELETE FROM basket_product WHERE basket_id = $1 AND product_id = $2', [
                        basketId,
                        productId,
                    ]);
                }
            }

            res.json({ message: 'Product quantity decremented' });
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    },

    // Удаление товара из корзины
    async clearForUser(req, res, next) {
        try {
            const userId = req.params.userId;
            await pool.query(`
                DELETE FROM basket_product
                WHERE basket_id IN (SELECT id FROM basket WHERE user_id = $1)
            `, [userId]);
    
            await pool.query(`DELETE FROM basket WHERE user_id = $1`, [userId]);
    
            res.json({ message: 'Basket cleared for user' });
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    },
    

    // Очистка корзины
    async clear(req, res, next) {
        try {
            const basketId = parseInt(req.signedCookies.basketId);

            await pool.query('DELETE FROM basket_product WHERE basket_id = $1', [basketId]);

            res.json({ message: 'Basket cleared' });
        } catch (e) {
            next(AppError.badRequest(e.message));
        }
    },
};

module.exports = BasketController;
