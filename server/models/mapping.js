import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database


const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

// связь между корзиной и товаром через промежуточную таблицу «basket_products»
// у этой таблицы будет составной первичный ключ (basket_id + product_id)
const BasketProduct = sequelize.define('basket_product', {
    quantity: {type: DataTypes.INTEGER, defaultValue: 1},
})