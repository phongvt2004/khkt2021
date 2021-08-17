const express = require('express');
const router = express.Router();
const authRoutes = require('./auth')
const systemRoutes = require('./system')
const groupRoutes = require('./group')
const adminRoutes = require('./admin')
const checkAdmin = require('../../app/middlewares/checkAdmin')

router.use('/auth', authRoutes);
router.use('/system', checkAdmin, systemRoutes);
router.use('/group/admin', adminRoutes);
router.use('/group', groupRoutes);


module.exports = router;