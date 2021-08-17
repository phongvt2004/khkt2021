const express = require('express');
const router = express.Router();
const chatRoute = require('./chat')
const adminRoute = require('./admin')
const QuestionController = require('../../app/controllers/QuestionController')
const TestController = require('../../app/controllers/TestController')
const checkTypeQuestion = require('../../app/middlewares/checkTypeQuestion')

router.get('/test', checkTypeQuestion, TestController.getTest)
router.post('/test', checkTypeQuestion, TestController.addTest)
router.put('/test', checkTypeQuestion, TestController.updateTest)
router.delete('/test', checkTypeQuestion, TestController.deleteTest)
router.put('/question/:id', checkTypeQuestion, QuestionController.updateQuestion)
router.delete('/question/:id', checkTypeQuestion, QuestionController.deleteQuestion)
router.post('/question', checkTypeQuestion, QuestionController.addQuestion)
router.use('/chat', chatRoute)
router.use('/admin', adminRoute)

// router.get('/:id', checkTypeQuestion, GroupController.getGroup)

module.exports = router