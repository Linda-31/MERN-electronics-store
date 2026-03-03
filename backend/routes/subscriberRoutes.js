const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { subscribe, getSubscribers, deleteSubscriber } = require('../controllers/subscriberController');

router.route('/')
    .post(subscribe)
    .get(protect, admin, getSubscribers);

router.route('/:id').delete(protect, admin, deleteSubscriber);

module.exports = router;
