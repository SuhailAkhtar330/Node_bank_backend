const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        required: true,
    },

    role: {
        type: String,
        enum: ['Manager', 'Employee', 'Customer'],
        default: "Customer",
    },

    mobile: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String
    },

    balance: {
        type: Number,
        default: 0,
    }

})

const UserSchema = mongoose.model('Person',PersonSchema);


module.exports = UserSchema;