const SystemQuestionController = require('../app/controllers/SystemQuestionController')
const checkAdmin = require('../app/middlewares/checkAdmin')
const {checkUser} = require('../app/middlewares/checkUser')
const express = require('express');
const router = express.Router();

router.post('/question/test', SystemQuestionController.getQuestionTest)
router.get('/question/server', SystemQuestionController.getQuestion)
router.get('/question//group/match', SystemQuestionController.getQuestionGroupMatch)
router.get('/question//user/match', SystemQuestionController.getQuestionUserMatch)
router.get('/question', checkUser, checkAdmin, SystemQuestionController.getQuestionList)
router.post('/question', checkUser, checkAdmin, SystemQuestionController.addQuestion)
router.put('/question', checkUser, checkAdmin, SystemQuestionController.updateQuestion)
router.delete('/question', checkUser, checkAdmin, SystemQuestionController.deleteQuestion)

module.exports = router;