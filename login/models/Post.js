const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Account',
           required: true 
        }, // reference to user who posted
    description: { 
        type: String, required: true
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
