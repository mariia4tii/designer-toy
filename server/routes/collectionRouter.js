const Router =require('express')
const router =new Router()
const collectionController = require('../controllers/collectionController')
const authMiddleware = require("../middleware/authMiddleware")
const checkRole = require('../middleware/checkRoleMiddleware')



router.get('/', collectionController.getAllCollection); // Получение всех дизайнеров
router.get('/:id',collectionController.getCollectionById); // , checkRole("admin") Получение дизайнера по ID
router.post('/', collectionController.postСollection);
router.delete('/:id', collectionController.deleteCollection, checkRole("admin")); // , checkRole("admin")Удаление пользователя
router.patch('/:id', collectionController.updateCollection, checkRole("admin")); // Обновление данных пользователя

module.exports=router