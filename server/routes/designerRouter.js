const Router =require('express')
const router =new Router()
const designerController = require('../controllers/designerController')
const authMiddleware = require("../middleware/authMiddleware")
const checkRole = require('../middleware/checkRoleMiddleware')



router.get('/', designerController.getAllDesigner); // Получение всех дизайнеров
router.get('/:id',designerController.getDesignerById, checkRole("admin"));
router.post('/',designerController.postDesigner, checkRole("admin")); // Получение дизайнера по ID
router.delete('/:id', designerController.deleteDesigner, checkRole("admin")); // Удаление пользователя
router.patch('/:id', designerController.updateDesigner, checkRole("admin")); // Обновление данных пользователя

module.exports=router