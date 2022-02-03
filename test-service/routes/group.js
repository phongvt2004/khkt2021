const GroupTestController = require('../app/controllers/GroupTestController')
const checkLeader = require('../app/middlewares/checkLeader')
const express = require('express');
const {checkUser} = require('../app/middlewares/checkUser')
const router = express.Router();

router.get('/test/all', checkLeader, GroupTestController.getAllTest)
router.get('/test/id', GroupTestController.getTestInfoById)
router.get('/test/server', GroupTestController.getTestInfo)
router.get('/test', checkUser, GroupTestController.getTestInfo)
router.get('/dotest', checkUser, GroupTestController.getTest)
router.post('/test', checkLeader, GroupTestController.addTest)
router.post('/result', GroupTestController.result)
router.put('/test', checkLeader, GroupTestController.updateTest)
router.patch('/test/addQuestion', GroupTestController.increaseQuestionNumber)
router.delete('/test',checkUser, checkLeader, GroupTestController.deleteTest)
router.delete('/all/test', GroupTestController.deleteAllTest)

module.exports = router;
