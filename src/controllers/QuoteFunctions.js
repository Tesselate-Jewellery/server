const {Quote} = require('../models/QuoteModel');

// Model.find({}) returns all documents in a collection.
async function getAllQuotes(){
    return await Quote.find({}).exec();
}

async function getQuoteById(QuoteID){
    return await Quote.findById(QuoteID).exec();
}

async function getQuotesByUser(userID){
    return await Quote.find({createdBy: userID}).exec();
}

async function createQuote(quoteDetails){
    return await Quote.create(quoteDetails);
}

async function updateQuote(quoteDetails){
    // Find quote, update it, return the updated opal data.
    return await Quote.findByIdAndUpdate(quoteDetails.opalID, quoteDetails.updatedData, {returnDocument: 'after'}).exec();
}

async function deleteQuote(quoteID){
    return await Quote.findByIdAndDelete(quoteID).exec();
}

module.exports = {
    getAllQuotes, getQuoteById, getQuotesByUser, createQuote, updateQuote, deleteQuote
}
