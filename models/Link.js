const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true
    },
    date: {
        type: String, 
        required: true
    },
    name: {
        type: String, 
        required: true
    }
})

module.exports = mongoose.model('Link', linkSchema)