const mongoose = require('mongoose')
const accScema = new mongoose.Schema({
    username: {
        type: String,
        reqiured: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Acc", accScema)