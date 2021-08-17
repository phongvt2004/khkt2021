const mongoose = require('mongoose');
const dbType = process.env.DB_TYPE || 'local';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 27017;
const dbName = process.env.DB_NAME || 'project';
const dbUsername = process.env.DB_USERNAME || 'username';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbURL = dbType === 'local' ? `mongodb://${dbHost}:${dbPort}` :  `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority` 
async function connect() {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('connect successfuly');
    } catch (error) {
        console.log('Cannot connect', error);
    }
}

module.exports = { connect };