$(document).ready(function() {
    let test = {}
    async function login(username, password) {
        let response = await axios.post('https://study-group-auth.herokuapp.com/login', {username, password});
        return response.data
    }
    $('.login button').click(function() {
        let username = $('input[name="username"]').val()
        let password = $('input[name="password"]').val()
        login(username, password)
            .then(response => {
                localStorage.setItem('username', response.username)
                localStorage.setItem('token', response.token)
            })
    })

    $('.question button').click(function() {
        let subject =$('.question .subject').val()
        let grade =$('.question .class').val()
        let correct =document.getElementById('correct').val()
        let question = $('input[name="question"]').val()
        let A = $('input[name="A"]').val()
        let B = $('input[name="B"]').val()
        let C = $('input[name="C"]').val()
        let D = $('input[name="D"]').val()
        let newQuestion = {
            subject,
            class: grade,
            question,
            correct,
            A,
            B,
            C,
            D
        }
        axios.post('https://study-group-question.herokuapp.com/system/question', newQuestion, {
            params: {
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token')
            }
        })
        .then(response => {
            console.log(response.data)
        })
    })

    $('.test button').click(function() {
        let subject =$('.test .subject').val()
        let grade =$('.test .class').val()
        let number =$('#number').val()
        let time = $('#time').val()
        axios.get('https://study-group-test.herokuapp.com/system/test', {
            params: {
                class: grade,
                subject,
                number,
                time
            }
        })
        .then(response => {
            localStorage.setItem('subject', subject)
            localStorage.setItem('time', time)
            localStorage.setItem('class', grade)
            console.log(response.data)
            addTest(response.data.questionList)
            for(let question of response.data.questionList) {
                test[question._id] = question.correct
            }
            console.log(test)
        })
    })

    function addTest(questions) {
        for(let i = 0; i < questions.length; i++) {
            console.log('ok')
            let question = $('<div></div>').text(questions[i].question)
            let A = $('<option></option>').text(questions[i].A).val('A').addClass('A')
            let B = $('<option></option>').text(questions[i].B).val('B').addClass('B')
            let C = $('<option></option>').text(questions[i].C).val('C').addClass('C')
            let D = $('<option></option>').text(questions[i].D).val('D').addClass('D')
            let correct = $('<div></div>').text(questions[i].correct).addClass('correct').hide()
            let answer = $('<select></select>').append(A, B, C, D, correct)
            $('#test').append($('<li>').addClass(`question-${i+1}`).attr('data-id', questions[i]._id).append(question, answer))
        }
    }

    function getResult(doneTest) {
        let result = 0
        for(let question of doneTest) {
            if(question.answer == test[question.id]) {
                ++result;
            }
        }
        let finalResult = result / doneTest.length
        return Number.isInteger(finalResult) ? finalResult * 10 : finalResult.toFixed(2) * 10;
    }

    $('.do-test button').click(function() {
        let doneTest = []
        let testHistory = []
        let questions = $('#test li')
        for(let question of questions) {
            let id = question.getAttribute('data-id')
            let questionClass = question.getAttribute('class')
            let answer = $(`.${questionClass} select`).val()
            let theQuestion = $(`.${questionClass} div`).text()
            let A = $(`.${questionClass} .A`).text()
            let B = $(`.${questionClass} .B`).text()
            let C = $(`.${questionClass} .C`).text()
            let D = $(`.${questionClass} .D`).text()
            testHistory.push({
                question: theQuestion,
                A,
                B,
                C,
                D,
                answer,
                correct: test[id]
            })
            doneTest.push({
                id,
                answer
            })
        }

        let result = getResult(doneTest)
        console.log(localStorage.getItem('subject'))
        axios.post('https://study-group-history.herokuapp.com/result/history', {
            subject: localStorage.getItem('subject'),
            time: localStorage.getItem('time'),
            class: localStorage.getItem('class'),
            point: result,
        }, {
            params: {
                username: localStorage.getItem('username'),
                token: localStorage.getItem('token')
            }
        })
        .then(response => response.data)
        .then(history => {
            return axios.post('https://study-group-history.herokuapp.com/test/history', {
                resultId: history._id,
                test: testHistory
            }, {
                params: {
                    username: localStorage.getItem('username'),
                    token: localStorage.getItem('token')
                }
            })
        })
        .then(response => console.log(response.data))
    })
})