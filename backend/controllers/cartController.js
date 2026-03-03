const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        res.json(cart);
    } else {
        res.json({ cartItems: [], shippingAddress: {} });
    }
});

// @desc    Add or Update item in cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { cartItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = cartItems || cart.cartItems;
        cart.shippingAddress = shippingAddress || cart.shippingAddress;
        cart.itemsPrice = itemsPrice ?? cart.itemsPrice;
        cart.shippingPrice = shippingPrice ?? cart.shippingPrice;
        cart.taxPrice = taxPrice ?? cart.taxPrice;
        cart.totalPrice = totalPrice ?? cart.totalPrice;
        await cart.save();
    } else {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: cartItems || [],
            shippingAddress: shippingAddress || {},
            itemsPrice: itemsPrice || 0,
            shippingPrice: shippingPrice || 0,
            taxPrice: taxPrice || 0,
            totalPrice: totalPrice || 0,
        });
    }

    res.status(201).json(cart);
});

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = [];
        await cart.save();
        res.json({ message: 'Cart cleared' });
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

module.exports = {
    getCart,
    addToCart,
    clearCart,
};
