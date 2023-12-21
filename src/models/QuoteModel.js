const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
    metal: { 
        type: String, 
        enum: ['', 'Silver', '9ct Gold', '18ct Gold'], 
        required: true 
    },
    setting: { 
        type: String, 
        enum: ['', 'bezel', 'claw'], 
        required: true 
    },
    ringSize: { 
        type: String, 
        required: true 
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