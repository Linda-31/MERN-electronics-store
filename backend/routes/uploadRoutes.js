const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Single image upload
// router.post('/', upload.single('image'), (req, res) => {
//     res.send(`/${req.file.path}`);
// });

// // Multiple image upload
// router.post('/multiple', upload.array('images', 5), (req, res) => {
//     const filePaths = req.files.map((file) => `/${file.path}`);
//     res.send(filePaths);
// });
// Single image upload
router.post('/', upload.single('image'), (req, res) => {
    // CHANGE: Use .replace(/\\/g, '/') to turn backslashes into forward slashes
    const cleanPath = req.file.path.replace(/\\/g, '/');
    res.send(`/${cleanPath}`);
});

// Multiple image upload
router.post('/multiple', upload.array('images', 5), (req, res) => {
    // CHANGE: Fix backslashes for every file in the array
    const filePaths = req.files.map((file) => `/${file.path.replace(/\\/g, '/')}`);
    res.send(filePaths);
});
module.exports = router;
