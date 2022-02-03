const admin = require('firebase-admin')
const serviceAccount = require('./firebase-cert.json')

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://upload-ba835.appspot.com',
})
// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
  bucket
}