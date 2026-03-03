const express = require('express');
const router = express.Router();
const {
    createOrUpdateDraftOrder,
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    createStripePaymentSession,
    createPaymentIntent,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/draft').post(protect, createOrUpdateDraftOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/pay-session').post(protect, createStripePaymentSession);
router.route('/payment-intent').post(protect, createPaymentIntent);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
