
const systemQuestions = require("../models/systemQuestion")
const systemQuestionCount = require("../models/systemQuestionCount")
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
class SystemQuestionController {
    getQuestionTest(req, res, next) {
        req.body.number = parseInt(req.body.number)
        systemQuestionCount.findOne({class: req.body.class, subject: req.body.subject})
            .then(count => {
                let list = []
                for(let i = 1; i <= count.count; i++) {
                    list.push(i)
                }
                
                list = shuffle(list);
                let indexList = list.splice(0, req.body.number)
                return indexList
            })
            .then(async function (indexList) {
                async function getQuestionList(indexList) {
                    let questionList = []
                    for(let index in indexList) {
                        let question = await systemQuestions.findOne({
                            class: req.body.class,
                            subject: req.body.subject,
                            index: indexList[index]
                        })
                        console.log(index, indexList.length - 1)
                        questionList.push(question)
                        if(index == indexList.length - 1) {
                            console.log(questionList)
                            return questionList
                        }
                    }
                }

                let questionList = await getQuestionList(indexList)
                res.json({questionList, time: req.body.time})
            })
            .catch(err => res.json({err}))
    }

    getQuestionGroupMatch(req, res, next) {
        systemQuestionCount.findOne({class: req.body.class, subject: req.body.subject})
            .then(count => {
                let list = []
                for(let i = 1; i <= count.count; i++) {
                    list.push(i)
                }
                
                list = shuffle(list);
                let indexList = list.splice(0, 20)
                return indexList
            })
            .then(async (indexList) => {
                async function getQuestionList(indexList) {
                    let questionList = []
                    for(let index in indexList) {
                        let question = await systemQuestions.findOne({
                            class: req.body.class,
                            subject: req.body.subject,
                            index: indexList[index]
                        })
                        console.log(index, indexList.length - 1)
                        questionList.push(question)
                        if(index == indexList.length - 1) {
                            console.log(questionList)
                            return questionList
                        }
                    }
                }

                let questionList = await getQuestionList(indexList)
                res.json({questionList, time: 30})
            })
            .catch(err => res.json({err}))
    }

    getQuestionUserMatch(req, res, next) {
        systemQuestionCount.find({class: req.body.class})
            .then(async (counts) => {
                
                try {
                    let number = 0
                    counts.forEach(count => {
                        number += count.count
                    })
                    async function getQuestionList() {
                        let questionList = []
                        for(let i = 0; i < 40; i++) {
                            let question = await systemQuestions.find({class: req.body.class}).skip(parseInt(Math.random() * number)).limit(1)
                            questionList.push(...question)
                            if(i == 39) {
                                console.log(questionList)
                                return questionList
                            }
                        }
                    }
            
                    let questionList = await getQuestionList()
                    res.json({questionList, time: 60})
                } catch (error) {
                    next(error)
                }
            })
    }

    getQuestion(req, res, next) {
        systemQuestions.findOne({_id: req.query.questionId})
            .then(question => {
                res.json(question)
            })
            .catch(next)
        
    }

    getQuestionList(req, res, next) {
        let grade = req.query?.class === 'all' || req.query?.class? null: req.query.class
        let subject = req.query?.subject === 'all' || req.query?.subject? null: req.query.subject
        let required = {}
        if(grade && subject) {
            required = {
                class: grade,
                subject
            }
        } else if(grade) {
            required = {
                class: grade
            }
        } else if(subject) {
            required = {
                subject
            }
        }
        systemQuestions.find(required)
            .then(questions => {
                res.json(questions)
            })
        
    }

    addQuestion(req, res, next) {
        systemQuestionCount.findOne({class: req.body.class, subject: req.body.subject})
            .then(count => {
                if(count) {
                    count.count += 1;
                    req.body.index = count.count
                    systemQuestionCount.updateOne({_id: count._id}, count)
                        .then()
                } else {
                    req.body.index = 1;
                    let questionCount = new systemQuestionCount({
                        class: req.body.class,
                        subject: req.body.subject,
                        count: 1
                    })
                    questionCount.save()
                }
                var question = new systemQuestions(req.body)
                return question.save()
            })
            .then(() => res.json({success: true}))
            .catch(err => res.json({err}))
    }

    updateQuestion(req, res, next) {
        systemQuestions.updateOne({_id: req.query.questionId}, req.body)
            .then(() => res.json({success: true}))
            .catch(err => res.json({err}))
    }

    deleteQuestion(req, res, next) {
        systemQuestions.deleteOne({_id: req.query.questionId})
            .then(() => res.json({success: true}))
            .catch(err => res.json({err}))
    }
}

module.exports = new SystemQuestionController;
