const mongoose = require('mongoose')
const carScema = new mongoose.Schema({
    marka: {
        type: String,
        reqiured: true,
    },
    model: {
        type: String,
        required: true,
    },
    VIN: {
        type: String,
        required: true,
    },
    regnum: {
        type: String,
        reqiured: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

module.exports = mongoose.model("Car", carScema)