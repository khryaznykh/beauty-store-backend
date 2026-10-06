const Router = require('express');
const router = new Router()
const controller = require('./userController');
const { AuthMiddleware } = require('./middleware/authMiddleware');
const { AdminMiddleware } = require('./middleware/adminMiddleware');


//public
router.post('/signup', controller.signupNewUser);
router.post('/signin',controller.login);
//no need to have signOut on backend because token is saved on frontend

router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

//Logged-in users only
router.get('/profile', AuthMiddleware, controller.getProfile);
router.delete('/profile', AuthMiddleware, controller.deleteProfile);


// Admin only
router.get(
    "/admin/subscribers",
    AuthMiddleware,
    AdminMiddleware,
    controller.allSubscribers
);
router.patch(
    '/admin/users/:id/role',
    AuthMiddleware,
    AdminMiddleware,
    controller.updateUserRole
)

module.exports =router;

