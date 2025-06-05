const path = require('path');
const pool = require('../db');
const fs = require('fs');

exports.uploadDesign = async (req, res) => {
    const { designer_id } = req.body;

    if (!req.file) {
        console.error('Файл не загружен!');
        return res.status(400).send('Файл обязателен!');
    }

    if (!designer_id) return res.status(400).send('designer_id не передан');

    const file_path = req.file.path;
    const file_name = req.file.originalname;

    console.log('Загружаем файл:', { designer_id, file_path, file_name });

    try {
        await pool.query(
            'INSERT INTO design_uploads (designer_id, file_path, file_name) VALUES ($1, $2, $3)',
            [designer_id, file_path, file_name]
        );
        res.status(200).send('Файл успешно загружен.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при сохранении файла.');
    }
};


exports.getAllDesigns = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM design_uploads');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при получении данных.');
    }
};

exports.updateDesignStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query('UPDATE design_uploads SET status = $1 WHERE id = $2', [status, id]);
        res.send('Статус обновлен.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при обновлении статуса.');
    }
};

exports.getDesignerUploads = async (req, res) => {
    const { designer_id } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM design_uploads WHERE designer_id = $1',
            [designer_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при получении загрузок.');
    }
};
