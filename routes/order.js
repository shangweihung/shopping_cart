var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order/modify_controller');
orderModifyMethod = new OrderModifyMethod();

const OrderGetMethod = require('../controllers/order/get_controller');
orderGetMethod = new OrderGetMethod();

// Get All orders
router.get('/order', orderGetMethod.getAllOrder)

// Book an order
router.post('/order', orderModifyMethod.postOrderAllProduct);

module.exports = router;