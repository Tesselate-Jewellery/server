const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
    metal: { 
        type: String, 
        required: false
    },
    setting: { 
        type: String, 
        required: false 
    },
    ringSize: { 
        type: String, 
        required: false 
    },
    pricing: { 
        type: Number, 
        required: true 
    },
    opal: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Opal', 
        required: true 
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
});

const Quote = mongoose.model('Quote', QuoteSchema);

module.exports = { Quote };