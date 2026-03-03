const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogById,
    deleteBlog,
    createBlog,
    updateBlog,
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBlogs).post(protect, admin, createBlog);
router
    .route('/:id')
    .get(getBlogById)
    .delete(protect, admin, deleteBlog)
    .put(protect, admin, updateBlog);

module.exports = router;
