const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require("../middleware/authMiddleware")
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.get('/auth',userController.check,authMiddleware)


router.get('/', userController.getAllUsers); // , checkRole("admin")Получение всех пользователей
router.get('/:id',userController.getUserById); //, checkRole("admin") Получение пользователя по ID
router.delete('/:id', userController.deleteUser); // , checkRole("admin")Удаление пользователя
router.put('/:id', userController.updateUser); //, checkRole("admin") Обновление данных пользователя


module.exports = router