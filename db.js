const mongoose = require('mongoose');
require('dotenv').config();

const mongodb_url = process.env.MONGODB_URL;

mongoose.connect(mongodb_url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
.then(() => console.log("Database Connection Successful!!"))
.catch((err) => console.error("Initial Connection Error:", err));

const db = mongoose.connection;

// db.on('connected', () => {
//     console.log("Database Connection Successful!!");
// })

db.on('error', (err) => {
    console.log('Connection issue with database!!', err)
})

db.on('disconnected', () => {
    console.log('Database disconnected!!')
})

module.exports = db;