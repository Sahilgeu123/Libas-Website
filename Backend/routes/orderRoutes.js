const express = require('express');
const router = express.Router();
const { protected } = require('../middleware/auth.Middleware');
const { admin } = require('../middleware/admin.Miiddleware');

const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController')

router.route('/').post(protected, createOrder).get(protected, admin, getOrders);
router.route('/:id').get(protected, getOrderById);
router.route('/:id/status').put(protected, admin, updateOrderStatus);

module.exports = router;