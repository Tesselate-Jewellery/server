const mongoose = require("mongoose");

const OpalSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,  
    },
    dimensions: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true,
    },
    origin: {
        type: String,
        required: true
    },
    brightness: {
        type: String,
        required: true
    },
    tone: {
        type: String,
        required: true
    },
    pricing: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
})

const Opal = mongoose.model('Opal', OpalSchema);

module.exports = { Opal };