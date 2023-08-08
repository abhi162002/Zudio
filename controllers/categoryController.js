import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";


export const createCategoryController = async(req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message: "Please Provide name",
            })
        }

        const existingCategory = await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category Already Exists",
            }) 
        }

        const category = await new CategoryModel({name, slug: slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: "New Category Created",
            category
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category",
        })
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const {name}=req.body;
        const {id}=req.params;
        const existingCategory = await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category Already Exists",
            }) 
        }
        const category = await CategoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true});
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully",
            category,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category"
        })
    }
};

//get all category
export const getCategoryController = async(req, res) => {
    try {
        const category = await CategoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Categories List',
            category,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting All category"
        });
    }
}

export const singleCategoryController = async(req, res) => {
    try {
        const {slug}=req.params;
        const existingCategory = await CategoryModel.findOne({slug})
        if(!existingCategory){
            return res.status(200).send({
                success: false,
                message: "Category Doesn't Exist",
            }) 
        }

        const category = await CategoryModel.findOne({slug});
        res.status(200).send({
            success: true,
            message: 'Get Single Category ',
            category,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Getting Single Category"
        })
    }
}

export const deleteCategoryController = async(req, res) => {
    try {
        const {id}=req.params;
        await CategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: 'Category Deleted Successfully ',
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while Deleting Single Category"
        })
    }
}