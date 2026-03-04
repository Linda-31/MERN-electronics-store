const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.json(categories);
});

// @desc    Search products with filters, sorting and pagination
// @route   GET /api/products/search
// @access  Public
const getSearchProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;
    const category = req.query.category || '';
    const price = req.query.price || '';
    const rating = req.query.rating || '';
    const order = req.query.order || '';
    const searchQuery = req.query.query || '';

    const queryFilter =
        searchQuery && searchQuery !== 'all'
            ? {
                name: {
                    $regex: searchQuery,
                    $options: 'i',
                },
            }
            : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
        rating && rating !== 'all'
            ? {
                rating: {
                    $gte: Number(rating),
                },
            }
            : {};
    const priceFilter =
        price && price !== 'all'
            ? {
                // 1-50
                price: {
                    $gte: Number(price.split('-')[0]),
                    $lte: Number(price.split('-')[1]),
                },
            }
            : {};
    const sortOrder =
        order === 'lowest'
            ? { price: 1 }
            : order === 'highest'
                ? { price: -1 }
                : order === 'toprated'
                    ? { rating: -1 }
                    : order === 'newest'
                        ? { createdAt: -1 }
                        : { _id: -1 };

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    });
    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    })
        .sort(sortOrder)
        .skip(pageSize * (page - 1))
        .limit(pageSize);

    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize),
    });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
        sku,
        colors,
        images,
    } = req.body;
const imagePaths = images && Array.isArray(images) 
        ? images.map(img => typeof img === 'object' ? img.url : img) 
        : [];
    const product = new Product({
        name: name || 'Sample name',
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        brand: brand || 'Sample brand',
        category: category || 'Sample category',
        countInStock: countInStock || 0,
        numReviews: 0,
        description: description || 'Sample description',
        sku: sku || 'radios-sku-000',
        colors: colors || [],
        logo: 'No',
        images: imagePaths || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
        sku,
        colors,
        logo,
        images,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const imagePaths = images && Array.isArray(images) 
            ? images.map(img => typeof img === 'object' ? img.url : img) 
            : product.images;
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
        product.sku = sku || product.sku;
        product.colors = colors || product.colors;
        product.logo = logo || product.logo;
       product.images = imagePaths;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    getCategories,
    getSearchProducts,
    createProductReview,
};
