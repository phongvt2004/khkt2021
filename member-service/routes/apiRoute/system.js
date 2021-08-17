
const express = require('express');
const router = express.Router();
const QuestionController = require('../../app/controllers/QuestionController')
const TestController = require('../../app/controllers/TestController')
const checkTypeQuestion = require('../../app/middlewares/checkTypeQuestion')

router.get('/test', checkTypeQuestion, TestController.getTest)
router.post('/question', checkTypeQuestion, QuestionController.addQuestion)
router.put('/question/:id', checkTypeQuestion, QuestionController.updateQuestion)
router.delete('/question/:id', checkTypeQuestion, QuestionController.deleteQuestion)

module.exports = router