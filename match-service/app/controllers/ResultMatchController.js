class ResultMatchController {
    async resultGroup(req, res, next) {
        try {
            let result = 0
            for(let question of req.body.test) {
                response = await axios.get(`${questionServiceAddress}/system/question/server`, {
                    params: {
                        questionId: question.questionId
                    }
                })
                if(response.data.correct == question.answer) {
                    ++result
                }
                if(req.body.test.indexOf(question)+1 == req.body.test.length) {
                    result = result/req.body.test.length
                    result = Number.isInteger(result) ? result * 10 : result.toFixed(2) * 10;
                    
                }
            }
        } catch (error) {
            console.log(error)
            res.json('error')
        }
    }
}