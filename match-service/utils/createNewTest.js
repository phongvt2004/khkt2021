const moment = require('moment-timezone');
const date = moment().tz("Asia/Ho_Chi_Minh");
const GroupMatchController = require('../app/controllers/GroupMatchController')
const UserMatchController = require('../app/controllers/UserMatchController')
const subjects = [
    "Toán",
    "Ngữ văn",
    "Sinh học",
    "Vật lý",
    "Hóa học",
    "Lịch sử",
    "Địa lý",
    "Tiếng Anh",
    "Công nghệ",
    "GDCD",
    "Tin học",
]
const grades = [10, 11, 12]
module.exports = {
    createNewTestGroup: async () => {
        let today = date.format('dddd')
        let time = date.format('h')
        if(today == 'Sunday' && time == 6 && date.format('a') == 'pm') {
            for (let grade of grades) {
                for (let subject of subjects) {
                    await GroupMatchController.createTestGroupMatch(subject, grade)
                    if(grades.indexOf(grade) == grades.length - 1 && subjects.indexOf(subject) == subjects.length - 1) {
                        console.log('ok')
                    }
                }
            }
        }
    },
    createNewTestUser: async () => {
        let today = date.format('dddd')
        let time = date.format('h')
        if(today == 'Saturday' && time == 6 && date.format('a') == 'pm') {
            for (let grade of grades) {
                await UserMatchController.createTestUserMatch(grade)
                if(grades.indexOf(grade) == grades.length - 1) {
                    console.log('ok')
                }
            }
        }
    }
}