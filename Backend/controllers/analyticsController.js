const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const Product = require('../models/productModel.js');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        
        const orders = await Order.find();

        const totalRevenueData = await orders.reduce((acc, order) => {
            return acc + order.totalAmount;
        }, 0);
        const totalRevenue = totalRevenueData[0]?.total || 0;
        res.status(200).json({
            success: true,
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenueData,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getAdminStats };