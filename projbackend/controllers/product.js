const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { parseInt, sortBy } = require("lodash");

exports.getProductById =(req,res,next,is)=> {
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Product not found"
            });
        }
        req.product = product;
        next();
    });
};
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions= true;

    form.parse(req,(err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }
        //restriction on products
        const {name,description,price,category,stock} = fields;
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error:"please include all fields"
            });
        }
       
        let product =new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size >3000000){
                return res.status(400).json({
                    error:"file is too big"
                })
            }
            product.photo.data= fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        };
        //save to the DB
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"saving tshirt in db FAILED"
                })
            }
            res.json(product)
        });
    });
};
exports.getProduct = (req,res) => {
    req.product.photo -undefined
    return res.json(req.product)
};
//middleware
exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        req.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};
//delete controller
exports.deleteProduct = (req,res) =>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            returnre.status(400).json({
                error: "Failed to delete product"
            })
        }
        res.json({
            message: "Product Deleted successfully !",
            deletedProduct
        })
    })
};
exports.updateProduct =(req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions= true;

    form.parse(req,(err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Problem with image"
            })
        }
       //updation code
        let product =req.product;
        product =_.extend(product,fields)

        //handle file here
        if(file.photo){
            if(file.photo.size >3000000){
                return res.status(400).json({
                    error:"file is too big"
                })
            }
            product.photo.data= fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        };
        //save to the DB
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error:"updation of product in db FAILED"
                })
            }
            res.json(product);
        });
    });  
};
//product listing
exports.getAllProducts =(req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"NO PRODUCT FOUND !!"
            })
        }
        res.json(products);
    })
};
exports.getAllUniqueCategories =(req,res)=> {
    Product.distinct("category",{} ,(err,category)=>{
        if(err){
            return res.status(400).json({
                err:"NO category found"
            });
        }
        res.json(category);
    });
};


exports.updateStock= (req, res) =>{
    let myOperations = req.body.products.map(prod =>{
        return{
            updateOne: {
                filter: {_id: prod._id},
                update:{$inc:{stock: -prod.count, sold: +prod.count}}
            }
        }
    })
    Product.bulkWrite(myOperations,{}, (err, products)=>{
        if(err){
            return res.status(400).json({
                err: "Bulk operation failed"
            })
        }
        next();
    });
};