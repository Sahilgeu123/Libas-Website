const express = require("express");
const { protected } = require("../middleware/auth.Middleware");
const { admin } = require("../middleware/admin.Miiddleware");

const {getProducts,getProductByid,createProduct,updateProduct,deleteProduct}  = require('../controllers/productController.js')

const router = express.Router();
//not need to write multiple lines get all product 
router.route('/').get(getProducts).post(protected,admin, createProduct);
//specific product
router.route('/:id').get(getProductByid).put(protected,admin,updateProduct).delete(protected,admin,deleteProduct)


/*
C - Post
R - GET
U - put
D - Delete
*/ 

module.exports = router;