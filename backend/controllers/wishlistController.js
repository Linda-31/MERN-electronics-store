const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (wishlist) {
        res.json(wishlist.products);
    } else {
        res.json([]);
    }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        if (wishlist.products.includes(productId)) {
            res.status(400);
            throw new Error('Product already in wishlist');
        }
        wishlist.products.push(productId);
        await wishlist.save();
    } else {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId],
        });
    }

    const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.status(201).json(updatedWishlist.products);
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:id
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== req.params.id
        );
        await wishlist.save();
        const updatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        res.json(updatedWishlist.products);
    } else {
        res.status(404);
        throw new Error('Wishlist not found');
    }
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
