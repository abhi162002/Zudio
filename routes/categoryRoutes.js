import express from "express";
import { isAdmin, requireSignIN } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router();

//router
router.post('/create-category', requireSignIN, isAdmin, createCategoryController);

//update Category
router.put('/update-category/:id', requireSignIN, isAdmin, updateCategoryController);

//getAll Category
router.get('/get-category', getCategoryController);

//get Single Category
router.get('/single-category/:slug', singleCategoryController);

//get Single Category
router.delete('/delete-category/:id', requireSignIN, isAdmin, deleteCategoryController);

export default router;