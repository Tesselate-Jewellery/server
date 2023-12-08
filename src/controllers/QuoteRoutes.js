// Import Express
const express = require('express');
// Create an instance of an Express Router
const router = express.Router();

const {
    getAllQuotes, getQuoteById, getQuotesByUser, createQuote, updateQuote, deleteQuote
} = require('./QuoteFunctions');

// Show all quotes
router.get('/', async (request, response) => {
    let allQuotes = await getAllQuotes();

    response.json({
        quotesCount: allQuotes.length,
        quotesArray: allQuotes
    });
});

// Show opals by specific user
router.get('/user/:userID', async (request, response) => {
    let quotesByUser = await getQuotesByUser(request.params.userID);

    response.json({
        quotesCount: quotesByUser.length,
        quotesArray: quotesByUser
    });
});

// Show specific quote by ID
router.get('/:quoteID', async (request, response) => {
    response.json(await getQuoteById(request.params.quoteID));
});

// Create a quote
router.post('/', async (request, response) => {
    response.json(await createQuote(request.body.quoteDetails));
});

// Update a specific quote
router.put('/:quoteID', async (request, response) => {
    let quoteDetails = {
        quoteID: request.params.quoteID,
        updatedData: request.body.newPostData
    };

    response.json(await updateQuote(quoteDetails));
});

// Delete a specific quote
router.delete('/:quoteID', async (request, response) => {
    response.json(await deleteQuote(request.params.quoteID));
});

// Export the router so that other files can use it:
module.exports = router;