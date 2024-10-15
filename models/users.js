const mongoose = require('mongoose')
const userScema = new mongoose.Schema({
    name: {
        type: String,
        reqiured: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        reqiured: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

module.exports = mongoose.model("User", userScema)