var express = require('express');
var router = express.Router();

const OrderModifyMethod = require('../controllers/order/modify_controller');
orderModifyMethod = new OrderModifyMethod();

const OrderGetMethod = require('../controllers/order/get_controller');
orderGetMethod = new OrderGetMethod();

// Get All orders
router.get('/order', orderGetMethod.getAllOrder);

// Get One Member's orders
router.get('/order/member', orderGetMethod.getOneOrder);

// Book an order
router.post('/order', orderModifyMethod.postOrderAllProduct);

// Edit an order
router.put('/order', orderModifyMethod.updateOrderProduct);

module.exports = router;