const SystemTestController = require('../app/controllers/SystemTestController')
const {checkUser} = require('../app/middlewares/checkUser')
const express = require('express');
const router = express.Router();

router.post('/test/user/match', SystemTestController.getTestUserMatch)
router.post('/test/group/match', SystemTestController.getTestGroupMatch)
router.post('/test', checkUser, SystemTestController.getTest)
router.post('/result', checkUser, SystemTestController.result)

module.exports = router;