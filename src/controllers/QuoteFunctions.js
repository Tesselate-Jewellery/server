const {Quote} = require('../models/QuoteModel');

// Model.find({}) returns all documents in a collection.
async function getAllQuotes(){
    return await Quote.find({}).exec();
}

// Find Quote by ID
async function getQuoteById(QuoteID){
    return await Quote.findById(QuoteID).exec();
}

// Find Quote by specific User
async function getQuotesByUser(userID){
    return await Quote.find({createdBy: userID}).exec();
}

// Create Quote
async function createQuote(quoteDetails){
    return await Quote.create(quoteDetails);
}

// Update Quote
async function updateQuote(quoteDetails){
    // Find quote, update it, return the updated opal data.
    return await Quote.findByIdAndUpdate(quoteDetails.quoteID, quoteDetails.updatedData, {returnDocument: 'after'}).exec();
}

// Delete Quote
async function deleteQuote(quoteID){
    return await Quote.findByIdAndDelete(quoteID).exec();
}

module.exports = {
    getAllQuotes, getQuoteById, getQuotesByUser, createQuote, updateQuote, deleteQuote
}
