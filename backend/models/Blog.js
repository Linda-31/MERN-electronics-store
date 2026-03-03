const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        authorImage: {
            type: String,
            required: true,
            default: '/uploads/sample-author.jpg'
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        excerpt: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        readingTime: {
            type: String,
            default: '3 min read',
        },
        numComments: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
