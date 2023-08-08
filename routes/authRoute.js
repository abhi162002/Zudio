import express from 'express';
import {registerController, loginController, forgotPasswordController, testController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } from '../controllers/authController.js';
import { isAdmin, requireSignIN } from '../middlewares/authMiddleware.js';

//router object
const router = express.Router();

//routing 

//REGISTER 
router.post("/register", registerController);

//LOGIN || POST
router.post('/login', loginController);

//forgot password || post
router.post('/forgot-password', forgotPasswordController);

//TEST ROUTE
router.get("/test", requireSignIN, isAdmin, testController);

//protected route auth
router.get('/user-auth', requireSignIN, (req, res) => {
    res.status(200).send({ok: true});
});

//protected Admin route auth
router.get('/admin-auth', requireSignIN, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
});

//update Profile
router.put('/profile', requireSignIN, updateProfileController);

//orders
router.get('/orders', requireSignIN, getOrdersController);

//orders
router.get('/all-orders', requireSignIN, isAdmin, getAllOrdersController);

//status update
router.put("/order-status/:orderId", requireSignIN, isAdmin, orderStatusController);

// module.exports = {router};
export default router;