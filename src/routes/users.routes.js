const express = require('express');
const { authenticateToken } = require('../middleware/auth.middleware');
const { checkUserAccess } = require('../middleware/ownership.middleware');
const { getById, getAllUsers, banUser } = require('../controllers/user.controller');
const { isAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

// POST
router.post('/ban/:id', authenticateToken, checkUserAccess, banUser)


// GET
router.get('/get-all', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, checkUserAccess, getById);


module.exports = router;