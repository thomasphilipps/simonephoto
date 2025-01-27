const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, `Le titre de l'image est requis`]
    },
    description: String,
    created_at: {
        type: Date,
        default: Date.now,
    },
    uri: {
        type: String,
        required: true,
       // match: /(https?:\/\/.*\.(?:png|jpg))/i
    },
    thumb_uri: {
        type: String,
        required: true,
    }
}, {timestamps: true})

module.exports=mongoose.model('Picture', pictureSchema);