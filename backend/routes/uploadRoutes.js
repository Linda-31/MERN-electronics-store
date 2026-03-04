// const path = require('path');
// const express = require('express');
// const multer = require('multer');

// const router = express.Router();

// const storage = multer.multer-storage-cloudinary({
//     destination(req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename(req, file, cb) {
//         cb(
//             null,
//             `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//         );
//     },
// });

// function checkFileType(file, cb) {
//     const filetypes = /jpg|jpeg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb('Images only!');
//     }
// }

// const upload = multer({
//     storage,
//     fileFilter: function (req, file, cb) {
//         checkFileType(file, cb);
//     },
// });

// // Single image upload
// // router.post('/', upload.single('image'), (req, res) => {
// //     res.send(`/${req.file.path}`);
// // });

// // // Multiple image upload
// // router.post('/multiple', upload.array('images', 5), (req, res) => {
// //     const filePaths = req.files.map((file) => `/${file.path}`);
// //     res.send(filePaths);
// // });
// // Single image upload
// router.post('/', upload.single('image'), (req, res) => {
//     // CHANGE: Use .replace(/\\/g, '/') to turn backslashes into forward slashes
//     const cleanPath = req.file.path;
//     res.send(`/${cleanPath}`);
// });

// // Multiple image upload
// router.post('/multiple', upload.array('images', 5), (req, res) => {
//     // CHANGE: Fix backslashes for every file in the array
//     const filePaths = req.files.map((file) => `/${file.path}`);
//     res.send(filePaths);
// });
// module.exports = router;
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
    res.send({
        message: 'Image Uploaded',
        url: req.file.path // This will be the https://cloudinary... URL
    });
});

// Multiple image upload (up to 5)
router.post('/multiple', upload.array('images', 5), (req, res) => {
    const filePaths = req.files.map((file) => file.path);
    res.send(filePaths);
});

module.exports = router;