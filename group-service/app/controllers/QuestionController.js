const {getSystemQues, getGroupQues} = require("./util/handleQuestion/getQuestion")
const {addSystemQues, addGroupQues} = require("./util/handleQuestion/addQuestion")
const {updateSystemQues, updateGroupQues} = require("./util/handleQuestion/updateQuestion")
const {deleteSystemQues, deleteGroupQues} = require("./util/handleQuestion/deleteQuestion")

class QuestionController {
    getSingleQuestion(req, res, next) {
        if (req.body.isSystem) {
            delete req.body.isSystem;
            var question = getSystemQues(1, null, null, req.body.questionId)
            question
                .then(question => res.json(question))
                .catch(next)
        } else {
            delete req.body.isSystem;
            var question = getGroupQues(1, null, null, req.body.questionId)
            question
                .then(question => res.json(question))
                .catch(next)
        }
    }

    getAllQuestion (req, res, next) {
        if (req.body.isSystem) {
            delete req.body.isSystem;
            var questions = getSystemQues('all', req.body.class, req.body.subject)
            questions
                .then(questions => res.json(questions))
                .catch(next)
        } else {
            delete req.body.isSystem;
            var questions = getGroupQues('all', req.body.class, req.body.subject, req.body.groupId)
            questions
                .then(questions => res.json(questions))
                .catch(next)
        }
    }

    addQuestion(req, res, next) {
        if(req.body.isSystem) {
            delete req.body.isSystem;
            addSystemQues(req.body)
                .then(res.json({success: true}))
                .catch(next)
        } else {
            delete req.body.isSystem;
            addGroupQues(req.body)
                .then(res.json({success: true}))
                .catch(next)
        }
    }

    updateQuestion(req, res, next) {
        if (req.body.isSystem) {
            delete req.body.isSystem;
            updateSystemQues(req.params.id, req.body)
                .then(res.json({success: true}))
                .catch(next)
        } else {
            delete req.body.isSystem;
            updateGroupQues(req.params.id, req.body.testId, req.body)
                .then(res.json({success: true}))
                .catch(next)
        }
    }

    deleteQuestion(req, res, next) {
        if (req.body.isSystem) {
            delete req.body.isSystem;
            deleteSystemQues(req.params.id)
                .then(res.json({success: true}))
                .catch(next)
        } else {
            delete req.body.isSystem;
            deleteGroupQues(req.params.id, req.query.testId)
                .then(res.json({success: true}))
                .catch(next)
        }
    }
}

module.exports = new QuestionController;