const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');

// @desc    Fetch all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
});

// @desc    Fetch single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        res.json(blog);
    } else {
        res.status(404);
        throw new Error('Blog post not found');
    }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = asyncHandler(async (req, res) => {
    const blog = new Blog({
        title: 'Sample Title',
        user: req.user._id,
        image: '/uploads/sample.jpg',
        author: 'Admin',
        authorImage: '/uploads/sample-author.jpg',
        category: 'Electronics',
        tags: ['Tech'],
        excerpt: 'Sample excerpt...',
        content: 'Sample content...',
        readingTime: '3 min read',
        numComments: 0,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = asyncHandler(async (req, res) => {
    const {
        title,
        image,
        author,
        authorImage,
        category,
        tags,
        excerpt,
        content,
        readingTime,
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
        blog.title = title;
        blog.image = image;
        blog.author = author;
        blog.authorImage = authorImage;
        blog.category = category;
        blog.tags = tags;
        blog.excerpt = excerpt;
        blog.content = content;
        blog.readingTime = readingTime;

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } else {
        res.status(404);
        throw new Error('Blog not found');
    }
});

module.exports = {
    getBlogs,
    getBlogById,
    deleteBlog,
    createBlog,
    updateBlog,
};
