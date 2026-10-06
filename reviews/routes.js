const { Router } = require('express');
const router = new Router();
const controller = require('./controller');
const { AuthMiddleware } = require('../auth/middleware/authMiddleware');
const { AdminMiddleware } = require('../auth/middleware/adminMiddleware');

//public
router.get("/products/:productId/reviews", controller.getPublishedReviews )

//logged in customers
router.post('/products/:productId/reviews', AuthMiddleware, controller.createReview)
router.get('/profile/my-reviews', AuthMiddleware, controller.getMyReviews)
router.patch('/profile/my-reviews/:reviewId', AuthMiddleware, controller.editMyReview)
router.delete('/profile/my-reviews/:reviewId', AuthMiddleware, controller.deleteMyReview)

//ADMIN only 
router.get('/admin/reviews', AuthMiddleware, AdminMiddleware, controller.getAdminAllReviews)
router.patch('/admin/reviews/:reviewId/status', AuthMiddleware, AdminMiddleware, controller.changeReviewStatus)

module.exports = router;