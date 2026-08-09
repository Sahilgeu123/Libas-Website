const express = require('express');
const router = express.Router();

const { protected } = require('../middleware/auth.Middleware');
const { admin } = require('../middleware/admin.Miiddleware');

const {getAdminStats} = require('../controllers/analyticsController.js');

router.get('/', protected, admin, getAdminStats);

module.exports = router;