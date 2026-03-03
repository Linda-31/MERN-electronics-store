const express = require('express');
const router = express.Router();
const {
    createContact,
    getContacts,
    getContactById,
    updateContactStatus,
    deleteContact
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(createContact)
    .get(protect, admin, getContacts);

router.route('/:id')
    .get(protect, admin, getContactById)
    .put(protect, admin, updateContactStatus)
    .delete(protect, admin, deleteContact);

module.exports = router;
