const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Create new contact message
// @route   POST /api/contacts
// @access  Public
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, website, message } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address');
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        website: website || '',
        message
    });

    if (contact) {
        res.status(201).json({
            _id: contact._id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            website: contact.website,
            message: contact.message,
            status: contact.status,
            createdAt: contact.createdAt
        });
    } else {
        res.status(400);
        throw new Error('Invalid contact data');
    }
});

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
});

// @desc    Get contact message by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
const getContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        // Mark as read when viewed
        if (!contact.isRead) {
            contact.isRead = true;
            await contact.save();
        }
        res.json(contact);
    } else {
        res.status(404);
        throw new Error('Contact message not found');
    }
});

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        contact.status = req.body.status || contact.status;
        contact.isRead = req.body.isRead !== undefined ? req.body.isRead : contact.isRead;

        const updatedContact = await contact.save();
        res.json(updatedContact);
    } else {
        res.status(404);
        throw new Error('Contact message not found');
    }
});

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
        await Contact.deleteOne({ _id: contact._id });
        res.json({ message: 'Contact message removed' });
    } else {
        res.status(404);
        throw new Error('Contact message not found');
    }
});

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};
