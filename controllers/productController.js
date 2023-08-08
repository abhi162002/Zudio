import slugify from "slugify";
import ProductModel from "../models/ProductModel.js"
import fs from 'fs'
import CategoryModel from "../models/CategoryModel.js";
import braintree from "braintree";
import orderModel from "../models/OrderModel.js";
import dotenv from 'dotenv';

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async(req, res) => {
    try {
        const {name, slug, description, price, category, quantity, shipping}=req.fields;
        const {photo}=req.files;
        
        //validation
        switch(true){
            case !name: 
                res.status(500).send({error: "Name is Required"})
            case !description: 
                res.status(500).send({error: "Description is Required"})
            case !price: 
                res.status(500).send({error: "Price is Required"})
            case !category: 
                res.status(500).send({error: "Category is Required"})
            case !quantity: 
                res.status(500).send({error: "Quantity is Required"})
            case photo && photo.size> 1000000: 
                res.status(500).send({error: "Photo is Required and should be less than 1mb"})
        }

        const products =new  ProductModel({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data =fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Creating Product",
            error,
        })
    }
}

//get all products 
export const getProductController = async(req, res) =>{
    try {
        const products = await ProductModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success: true,
            total: products.length,
            message: "All Products",
            products,
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message,
        })
    }
}

//get single product
export const getSingleProductController = async(req, res) =>{
    try {
        const product=await ProductModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        return res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting Single Product",
            error,
        })
    }
}

//get photo controller
export const productPhotoController = async(req, res) =>{
    try {
        const product=await ProductModel.findById(req.params.pid).select("photo");
        if(product.photo.data){
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(
                product.photo.data,
            );
        }
       
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting Product Photo",
            error,
        });
    }
}

//delete product controller
export const deleteProductController = async(req, res) =>{
    try {
        await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");
        return res.status(200).send({
            success: true,
            message: 'Product Deleted Successfully',
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Deleting Product",
            error,
        });
    }
}

//update product controller
export const updateProductController = async(req, res) =>{
    try {
        const {name, slug, description, price, category, quantity, shipping}=req.fields;
        const {photo}=req.files;

        //validation
        switch(true){
            case !name: 
                res.status(500).send({error: "Name is Required"})
            case !description: 
                res.status(500).send({error: "Description is Required"})
            case !price: 
                res.status(500).send({error: "Price is Required"})
            case !category: 
                res.status(500).send({error: "Category is Required"})
            case !quantity: 
                res.status(500).send({error: "Quantity is Required"})
            case photo && photo.size> 1000000: 
                res.status(500).send({error: "Photo is Required and should be less than 1mb"})
        }

        const products=await ProductModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)}, {new:true}
            )
        if(photo){
            products.photo.data =fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success:true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Updating Product",
            error,
        });
    }
}

//filters
export const productFilterController = async (req, res) => {
    try {
        const {checked, radio}=req.body;
        let args = {};
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte : radio[0], $lte: radio[1]}
        const products = await ProductModel.find(args)
        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while Filtering Product",
            error,
        });
    }
}

//product count
export const productCountController = async (req, res) => {
    try {
        const total=await ProductModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Product Count",
            error,
        });
    }
}

//product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage= 6;
        const page = req.params.page ? req.params.page: 1;
        const products = await ProductModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt: -1});
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in per page ctrl",
            error,
        });
    }
}

//search product Controller
export const searchProductController  = async (req, res) => {
    try {
        const {keyword} = req.params;
        const results = await ProductModel.find({
            $or: [
                {name: {$regex: keyword, $options: "i"}},
                {description: {$regex: keyword, $options: "i"}}
            ]
        }).select("-photo");

        res.json(results);
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Seaching Product ",
            error,
        });
    }
}

//search product Controller
export const relatedProductController  = async (req, res) => {
    try {
        const {pid, cid} = req.params;
        const products = await ProductModel.find({
            category: cid,
            _id: {$ne: pid},
        }).select("-photo").limit(3).populate("category");

        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting related Product ",
            error,
        });
    }
}

//search product Controller
export const productCategoryController  = async (req, res) => {
    try {
        const category=await CategoryModel.findOne({slug: req.params.slug});
        const products = await ProductModel.find({category}).populate('category');

        res.status(200).send({
            success: true,
            category,
            products,
        });
        
    } catch (error) {
        // console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting Category Product ",
            error,
        });
    }
}

//payment gateway api
export const braintreeTokenController  = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function(err, response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response);
            }
        });        
    } catch (error) {
        // console.log(error);
    }
};

//payment
export const brainTreePaymentController = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new orderModel({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (error) {
    //   console.log(error);
    }
  };
  
