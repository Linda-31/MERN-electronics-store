const path = require('path');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDY_NAME,
    api_key: process.env.CLOUDY_API_KEY,
    api_secret: process.env.CLOUDY_API_SECRET,
});

// 2. Setup Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // The name of the folder in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png'],
        // You can add transformations here if needed
    },
});

// 3. File Filter (Keep your validation logic)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// --- Routes ---

// Single image upload
router.post('/', upload.single('image'), (req, res) => {
    // Cloudinary returns the full URL in req.file.path
    res.send(req.file.path);
});

module.exports = router;