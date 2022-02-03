const GroupQuestionController = require('../app/controllers/GroupQuestionController')
const checkLeader = require('../app/middlewares/checkLeader')
const {checkUser} = require('../app/middlewares/checkUser')
const express = require('express');
const router = express.Router();

router.get('/question/test', GroupQuestionController.getQuestionTest)
router.get('/question', GroupQuestionController.getQuestion)
router.delete('/question/all', GroupQuestionController.deleteAllQuestion)
router.post('/question', checkUser, checkLeader, GroupQuestionController.addQuestion)
router.put('/question', checkUser, checkLeader, GroupQuestionController.updateQuestion)
router.delete('/question', checkUser, checkLeader, GroupQuestionController.deleteQuestion)

module.exports = router;
