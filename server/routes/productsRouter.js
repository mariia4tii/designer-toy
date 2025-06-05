const Router =require('express')
const router =new Router()
const productsController = require('../controllers/productsController')
const authMiddleware = require("../middleware/authMiddleware")
const checkRole = require('../middleware/checkRoleMiddleware')


//для админа и для пользователя
router.get('/', productsController.getAll); 
//router.get('/:name',productsController.getProductByname);
router.get('/:id', productsController.getProductById); 
//router.get('/:id',productsController.getProductById);
router.post('/',productsController.create) // , checkRole("admin")добавить пользователя
router.delete('/:id', productsController.deleteProduct, checkRole("admin"))
router.patch('/:id', productsController.updateProduct, checkRole("admin")); 

module.exports=router