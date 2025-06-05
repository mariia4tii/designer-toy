const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');
const multer = require('multer');
const path = require('path');

// Хранилище для PDF
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/designs');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/upload-design', upload.single('file'), designController.uploadDesign);

router.get('/design-uploads', express.json(), designController.getAllDesigns);
router.get('/design-uploads/by-designer', designController.getDesignerUploads);
router.put('/design-uploads/:id', express.json(), designController.updateDesignStatus);

module.exports = router;
