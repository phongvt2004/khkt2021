const MessagesUploads = require('../models/messagesUploads')
const multer = require('multer')
const randtoken = require('rand-token');
const firebase = require('../../config/firebase')
const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
})
async function uploadFile(file, filePath) {
    return new Promise((resolve, reject) => {
        console.log('uploading')
        console.log(file)
        let token = randtoken.generate(32)
        const blob = firebase.bucket.file(filePath+token+'-'+file.originalname)
    
        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })
        
        blobWriter.on('error', (err) => {
            console.log(err)
        })
        
        blobWriter.on('finish', () => {
            blob.makePublic()
                .then(() => {
                    resolve(blob.publicUrl())
                })
                .catch(err => reject(err));

        })
        
        blobWriter.end(file.buffer)
    })
}
class UploadController {
    getAllImagesOrVideo(req, res, next) {
        Promise.all([
            MessagesUploads.find({groupId: req.query.groupId, type: 'image'}),
            MessagesUploads.find({groupId: req.query.groupId, type: 'video'})
        ])
        .then(([images, video]) => {
            let media = [...images, ...video]
            res.json(media)
        })
        .catch(next)
    }

    getAllFiles(req, res) {
        MessagesUploads.find({groupId: req.query.groupId, type: 'file'})
            .then((files) => {
                res.json(files)
            })
            .catch(next)
    }

    uploadAvatarLocal(req, res, next) {
        upload.single('avatar')(req, res, err => {
            if (err) {
                res.status(400).json(err)
            } else {
                console.log(req)
                next();
            }
        })
    }


    uploadFiles(req, res, next) {
        upload.array('files', 10)(req, res, err => {
            if (err) {
                console.log(err)
                if(err["code"] === 'LIMIT_UNEXPECTED_FILE') {
                    res.json({success: false, message:'Limit of files is 10'})
                } else {
                    res.status(400).json(err)
                }
            } else {
                next();
            }
        })
    }

    uploadMessageFiles(req, res, next) {
        if(!req.files) {
            res.status(400).json("Error: No files found")
        }
        ;(async function uploadFiles(req, res) {
            console.log('uploading to firebase')
            console.log(req.body.groupId)
            console.log(req.body.username)
            let fileURLs = [];
            let filePath = `messages/${req.body.groupId}/`;
            for(let i = 0; i < req.files.length; i++) {
                console.log('ok')
                uploadFile(req.files[i], filePath)
                    .then((fileURL) => {
                        let type
                        if(req.files[i].mimetype.includes('image')) {
                            type = 'image'
                        } else if(req.files[i].mimetype.includes('video')) {
                            type = 'video'
                        } else {
                            type = 'file'
                        }
                        let messagesUploads = new MessagesUploads({
                            groupId: req.body.groupId,
                            uploadURL: fileURL,
                            type
                        })
                        messagesUploads.save()
                        console.log(fileURL)
                        fileURLs.push({fileURL, type})
                        console.log(i, req.files.length)
                        if(fileURLs.length === req.files.length) {
                            res.json(fileURLs)
                        }
                    })
                    .catch(next)
                
            }
            
        })(req, res)
    }

    uploadQuestionFiles(req, res, next) {
        if(!req.files) {
            return res.status(400).send("Error: No files found")
        }
    
        ;(async function uploadFiles(req, res) {
            let fileURLs = [];
            let folder = req.body.type === "system" ? 'system' : req.body.groupId;
            let filePath = `questions/${folder}/`;
            for(let i in req.files) {
                uploadFile(req.files[i], filePath)
                    .then(fileURL => {
                        fileURLs.push(fileURL)
                        console.log(i, req.files.length)
                        if(fileURLs.length === req.files.length) {
                            console.log(fileURLs)
                            res.json(fileURLs)
                        }
                    })
                    .catch(next)
                
            }
            
        })(req, res)
    }

    uploadAvatar(req, res, next) {
        uploadFile(req.file, 'avatar/')
            .then(fileURL => res.json(fileURL))
            .catch(next)
    }

    test(req, res, next) {
        let fileURLs = [];
        console.log(req.files.length)
        for(let i = 0; i < req.files.length; i++) {
            console.log('ok')
            uploadFile(req.files[i], 'test/')
                .then(fileURL => {
                    fileURLs.push(fileURL)
                    console.log(i, req.files.length)
                    if(fileURLs.length === req.files.length) {
                        res.json(fileURLs)
                    }
                })
                .catch(err => res.json(err))
        }
    }

    deleteUploadMessageFiles(req, res, next) {
        MessagesUploads.deleteOne({uploadURL: req.query.fileUrl})
            .then(()=>res.json('ok'))
    }
}

module.exports = new UploadController
