const UploadController = require('../app/controllers/UploadController')
function route(app) {
    app.get('/upload/messages/image-and-video', UploadController.getAllImagesOrVideo)
    app.get('/upload/messages/files', UploadController.getAllFiles)
    app.post('/upload/messages', UploadController.uploadFiles, UploadController.uploadMessageFiles)
    app.post('/upload/questions', UploadController.uploadFiles, UploadController.uploadQuestionFiles)
    app.post('/upload/avatar', UploadController.uploadAvatarLocal, UploadController.uploadAvatar)
    app.post('/upload/test', UploadController.uploadFiles, UploadController.test)
    app.delete('/upload/messages', UploadController.deleteUploadMessageFiles)
    app.get('/', (req, res) => {
        res.json('upload')
    })
}

module.exports = route;
