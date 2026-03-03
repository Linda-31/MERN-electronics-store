const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create or update draft order
// @route   POST /api/orders/draft
// @access  Private
const createOrUpdateDraftOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Check if user already has a draft order
    let order = await Order.findOne({ user: req.user._id, orderStatus: 'draft' });

    if (order) {
        // Update existing draft order
        order.orderItems = orderItems.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            product: item._id,
        }));
        order.shippingAddress = shippingAddress;
        order.itemsPrice = itemsPrice;
        order.taxPrice = taxPrice;
        order.shippingPrice = shippingPrice;
        order.totalPrice = totalPrice;
        await order.save();
    } else {
        // Create new draft order
        order = await Order.create({
            orderItems: orderItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id,
            })),
            user: req.user._id,
            shippingAddress,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderStatus: 'draft',
        });
    }

    res.status(201).json(order);
});


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

// @desc    Create Stripe Payment Session
// @route   POST /api/orders/pay-session
// @access  Private
const createStripePaymentSession = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    let order;

    if (orderId) {
        order = await Order.findById(orderId);
    } else {
        // Fallback to current user's draft order
        order = await Order.findOne({ user: req.user._id, orderStatus: 'draft' });
    }

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.orderItems.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    // images: [item.image], // Stripe Checkout images must be absolute URLs
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        })),
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order/${order._id}?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/payment?cancel=true`,
        metadata: {
            orderId: order._id.toString(),
        },
    });

    res.json({ url: session.url });
});

// @desc    Create Stripe Payment Intent
// @route   POST /api/orders/payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount, orderId } = req.body;

    // 1. Resolve the OrderID (from body or fallback to draft)
    let finalOrderId = orderId;
    if (!finalOrderId) {
        const draftOrder = await Order.findOne({ user: req.user._id, orderStatus: 'draft' });
        if (draftOrder) {
            finalOrderId = draftOrder._id;
        }
    }

    // 2. Fetch specific shipping details (Mandatory for Indian Export regulations)
    let shippingInfo = null;
    let description = 'Radios Store Purchase';

    if (finalOrderId) {
        const order = await Order.findById(finalOrderId);
        if (order && order.shippingAddress) {
            description = `Payment for Radios Store Order: ${finalOrderId}`;
            shippingInfo = {
                name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
                address: {
                    line1: order.shippingAddress.address,
                    line2: order.shippingAddress.address2 || '',
                    city: order.shippingAddress.city,
                    postal_code: order.shippingAddress.postalCode,
                    state: order.shippingAddress.state || '',
                    country: 'IN', // Stripe India requires specifically 'IN' for export/regulatory checks
                },
            };
        }
    }

    // 3. Create the PaymentIntent with regulatory fields
    const intentOptions = {
        amount: Math.round(amount * 100),
        currency: 'inr',
        description: description,
        metadata: {
            orderId: finalOrderId ? finalOrderId.toString() : 'new_order',
            userId: req.user._id.toString()
        },
        automatic_payment_methods: {
            enabled: true,
        },
    };

    // Include shipping if available (highly recommended for India regulations)
    if (shippingInfo) {
        intentOptions.shipping = shippingInfo;
    }

    const paymentIntent = await stripe.paymentIntents.create(intentOptions);

    res.json({
        clientSecret: paymentIntent.client_secret,
        orderId: finalOrderId
    });
});

module.exports = {
    createOrUpdateDraftOrder,
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    createStripePaymentSession,
    createPaymentIntent,
};
