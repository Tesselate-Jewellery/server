// Import Express
const express = require('express');
// Create an instance of an Express Router
const router = express.Router();

const {
    getAllOpals, getOpalById, getOpalsByAdmin, createOpal, updateOpal, deleteOpal
} = require('./OpalFunctions');

const jwt = require('jsonwebtoken');
const { Role } = require('../models/RoleModel');
const { Opal } = require('../models/OpalModel');
const { verifyUserJWT, decryptString } = require('./UserFunctions');
const { User } = require('../models/UserModel');

const { 
    verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, onlyAllowAdminsAndStaff 
} = require('../utils');

// Show all opals
router.get('/', async (request, response) => {
    let allOpals = await getAllOpals();

    response.json({
        // Returns a count of how many opals in database
        opalsCount: allOpals.length,
        opalsArray: allOpals
    });
});

// Show opals by specific admin
router.get('/admin/:adminID', async (request, response) => {
    let opalsByAuthor = await getOpalsByAdmin(request.params.adminID);

    response.json({
        opalsCount: opalsByAuthor.length,
        opalsArray: opalsByAuthor
    });
});

// Show specific opal by ID
router.get('/:opalID', async (request, response) => {
    response.json(await getOpalById(request.params.opalID));
});

// Create an opal
router.post('/', verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, async (request, response) => {
    try {
        // Get the user ID from the JWT payload
        const userId = request.headers.userID;

        // Combine opalDetails with createdBy field
        const opalDetails = {
            ...request.body,
            createdBy: userId,
        };

        // Create opal
        const createdOpal = await createOpal(opalDetails);

        response.json(createdOpal);
    } catch (error) {
        console.error("Error in creating opal:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// Update a specific opal
router.put('/:opalID', verifyJwtHeader, verifyJwtRole, onlyAllowAdminsAndStaff, async (request, response) => {
    let opalDetails = {
        opalID: request.params.opalID,
        updatedData: request.body
    };

    response.json(await updateOpal(opalDetails));
});

// Delete a specific opal
router.delete('/:opalID', verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, async (request, response) => {
    response.json(await deleteOpal(request.params.opalID));
});

// Export the router so that other files can use it:
module.exports = router;