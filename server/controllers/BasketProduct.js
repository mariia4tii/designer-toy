import db from '../db.js' // Подключение к вашей базе данных
import AppError from '../errors/ApiError.js'

const check = async (req, res, next) => {
    try {
        const basketId = req.signedCookies.basketId
        if (!basketId) {
            throw new Error('Корзина еще не создана')
        }

        const { rows } = await db.query('SELECT 1 FROM basket WHERE id = $1', [basketId])
        if (!rows.length) {
            res.clearCookie('basketId')
            throw new Error('Корзина не найдена в БД')
        }
    } catch (e) {
        next(AppError.badRequest(e.message))
    }
}

class BasketProduct {
    async getAll(req, res, next) {
        await check(req, res, next)
        try {
            const basketId = req.signedCookies.basketId
            const { rows: products } = await db.query(
                `SELECT bp.product_id, bp.quantity, p.name, p.price 
                 FROM basket_product bp
                 JOIN products p ON p.id = bp.product_id
                 WHERE bp.basket_id = $1`,
                [basketId]
            )
            res.json(products)
        } catch (e) {
            next(AppError.badRequest(e.message))
        }
    }

    async create(req, res, next) {
        await check(req, res, next)
        try {
            const basketId = req.signedCookies.basketId
            const { productId } = req.params
            const { quantity = 1 } = req.body

            if (!productId) {
                throw new Error('Не указан id товара')
            }

            const { rows: item } = await db.query(
                `INSERT INTO basket_product (basket_id, product_id, quantity) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT (basket_id, product_id) 
                 DO UPDATE SET quantity = basket_product.quantity + $3 
                 RETURNING *`,
                [basketId, productId, quantity]
            )

            res.json(item[0])
        } catch (e) {
            next(AppError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        await check(req, res, next)
        try {
            const basketId = req.signedCookies.basketId
            const { productId } = req.params
            const { quantity } = req.body

            if (!productId || !quantity) {
                throw new Error('Не указаны id товара или количество')
            }

            const { rows: item } = await db.query(
                `UPDATE basket_product 
                 SET quantity = $3, updated_at = CURRENT_TIMESTAMP 
                 WHERE basket_id = $1 AND product_id = $2 
                 RETURNING *`,
                [basketId, productId, quantity]
            )

            if (!item.length) {
                throw new Error('Товар не найден в корзине')
            }

            res.json(item[0])
        } catch (e) {
            next(AppError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        await check(req, res, next)
        try {
            const basketId = req.signedCookies.basketId
            const { productId } = req.params

            if (!productId) {
                throw new Error('Не указан id товара')
            }

            const { rowCount } = await db.query(
                `DELETE FROM basket_product 
                 WHERE basket_id = $1 AND product_id = $2`,
                [basketId, productId]
            )

            if (!rowCount) {
                throw new Error('Товар не найден в корзине')
            }

            res.json({ message: 'Товар удалён' })
        } catch (e) {
            next(AppError.badRequest(e.message))
        }
    }
}

export default new BasketProduct()
