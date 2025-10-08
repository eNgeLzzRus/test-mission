const express = require('express');
const { register, authorization } = require('../controllers/auth.controller');

const router = express.Router();

// POST
router.post('/register', register);
router.post('/login', authorization);

// GET


module.exports = router;