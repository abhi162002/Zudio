import express from "express";
import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";
import { brainTreePaymentController,  braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from 'express-formidable';

const router = express.Router();

//routes
router.post('/create-product', requireSignIN, isAdmin, formidable(), createProductController);

// get products
router.get('/get-product', getProductController);

//single product
router.get('/get-product/:slug', getSingleProductController);

//get photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/product/:pid', deleteProductController);

//update product
router.put('/update-product/:pid', requireSignIN, isAdmin, formidable(), updateProductController);

//filter product 
router.post('/product-filters', productFilterController);

//count product 
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//search product
router.get('/search/:keyword', searchProductController);

//similar product
router.get('/related-product/:pid/:cid', relatedProductController);

//category wise product
router.get('/product-category/:slug', productCategoryController);

//payments routes
//token
router.get('/braintree/token', braintreeTokenController);

//payments
router.post('/braintree/payment', requireSignIN, brainTreePaymentController);

export default router;