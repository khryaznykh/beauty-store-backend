const { Router } = require("express");
const router = new Router();
const controller = require('./controller');
const { AdminMiddleware } = require("../auth/middleware/adminMiddleware");
const { AuthMiddleware } = require("../auth/middleware/authMiddleware");

//PUBLIC
router.get('/products', controller.getAllProducts);
router.get('/products/:id', controller.getProductById);


//ADMIN only
router.post('/products', AuthMiddleware, AdminMiddleware, controller.createProduct);
router.put('/products/:id', AuthMiddleware, AdminMiddleware, controller.updateProduct);
router.delete('/products/:id', AuthMiddleware, AdminMiddleware, controller.deleteProduct)

module.exports = router;