const Product = require('../models/productModel')
const cloudinary=require('../config/cloudnary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});  
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const saveedProduct = await product.save();
        res.status(201).json(saveedProduct);
    }catch (error) {
  console.error("Create product error:", error);
  res.status(400).json({
    message: error.message,
    errors: error.errors
  });
} };



const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imgUrl = result.secure_url;
            }
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating product' });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        return res.status(200).json({ message: 'Product removed', id: product._id });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Error deleting product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
