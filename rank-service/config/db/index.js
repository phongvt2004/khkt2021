const mongoose = require('mongoose');
const dbURL = process.env.DB_URL 
async function connect() {
    try {
        await mongoose.connect(dbURL);
        console.log('connect successfuly');
    } catch (error) {
        console.log('Cannot connect', error);
    }
}

module.exports = { connect };