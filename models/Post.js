const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: { 
        type: String, 
        required: true
     },
    image: { 
        type: String, 
        required: true 
    }, // filename of the uploaded image
    createdAt: { 
        type: Date,
         default: Date.now 
        }
});

module.exports = mongoose.model('Post', postSchema);
