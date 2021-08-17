const express = require('express');
const router = express.Router();
const ChatController = require('../../app/controllers/ChatController')

router.get('/', ChatController.getAllChatMessage);
router.post('/', ChatController.uploadFile);

module.exports = router;