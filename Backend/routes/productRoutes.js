const express = require("express");
const { protected } = require("../middleware/auth.Middleware");
const { admin } = require("../middleware/admin.Miiddleware");

const {getProducts,getProductById,createProduct,updateProduct,deleteProduct}  = require('../controllers/productController.js')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the destination folder for uploaded files


const router = express.Router();
//not need to write multiple lines get all product 
router.route('/').get(getProducts).post(protected,admin,upload.single('img'), createProduct);
//specific product
router.route('/:id').get(getProductById).put(protected,admin,upload.single('img'), updateProduct).delete(protected,admin,deleteProduct)


/*
C - Post
R - GET
U - put
D - Delete
*/ 

module.exports = router;