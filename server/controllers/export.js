const express = require('express');
const pool = require('../db'); 
const { Parser } = require('json2csv');

const router = express.Router();  // Здесь создается экземпляр роутера

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM public.orders');
        console.log('Полученные строки:', rows);  // Выводим данные в консоль

        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(rows);

        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        res.send(csvData);
    } catch (err) {
        console.error('Ошибка экспорта данных:', err);
        res.status(500).send('Ошибка экспорта данных');
    }
});


module.exports = router;
