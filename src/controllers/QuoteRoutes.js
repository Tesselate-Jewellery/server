// Import Express
const express = require('express');
// Create an instance of an Express Router
const router = express.Router();

const jwt = require('jsonwebtoken');
const { Role } = require('../models/RoleModel');
const { Quote } = require('../models/QuoteModel');
const { verifyUserJWT, decryptString } = require('./UserFunctions');
const { User } = require('../models/UserModel');

const { 
    verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, onlyAllowAdminsAndStaff 
} = require('../utils');

const {
    getAllQuotes, getQuoteById, getQuotesByUser, createQuote, updateQuote, deleteQuote
} = require('./QuoteFunctions');

// Show all quotes
router.get('/', verifyJwtHeader, verifyJwtRole, onlyAllowAdminsAndStaff, async (request, response) => {
    let allQuotes = await getAllQuotes();

    response.json({
        quotesCount: allQuotes.length,
        quotesArray: allQuotes
    });
});

// Show quotes by specific user
router.get('/quotes/:userID', verifyJwtHeader, verifyJwtRole, onlyAllowAdminsAndStaff, async (request, response) => {
    let quotesByUser = await getQuotesByUser(request.params.userID);

    response.json({
        quotesCount: quotesByUser.length,
        quotesArray: quotesByUser
    });
});

// Show specific quote by ID
router.get('/:quoteID', verifyJwtHeader, verifyJwtRole, onlyAllowAdminsAndStaff, async (request, response) => {
    response.json(await getQuoteById(request.params.quoteID));
});

// Create a quote
router.post('/', verifyJwtRole, async (request, response) => {
    try {
        // Get the user ID from the JWT payload
        const userId = request.headers.userID;

        // Combine opalDetails with createdBy field
        const quoteDetails = {
            ...request.body,
            createdBy: userId,
        };

        // Create quote
        const createdQuote = await createQuote(quoteDetails);

        response.json(createdQuote);
    } catch (error) {
        console.error("Error in creating quote:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a specific quote
router.put('/:quoteID', verifyJwtHeader, verifyJwtRole, onlyAllowAdminsAndStaff, async (request, response) => {
    let quoteDetails = {
        quoteID: request.params.quoteID,
        updatedData: request.body
    };

    response.json(await updateQuote(quoteDetails));
});

// Delete a specific quote
router.delete('/:quoteID', verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, async (request, response) => {
    response.json(await deleteQuote(request.params.quoteID));
});

// Export the router so that other files can use it:
module.exports = router;