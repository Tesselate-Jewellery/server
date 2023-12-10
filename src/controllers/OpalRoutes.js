// Import Express
const express = require('express');
// Create an instance of an Express Router
const router = express.Router();

const {
    getAllOpals, getOpalById, getOpalsByAdmin, createOpal, updateOpal, deleteOpal
} = require('./OpalFunctions');

// Show all opals
router.get('/', async (request, response) => {
    let allOpals = await getAllOpals();

    response.json({
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
router.post('/', async (request, response) => {
    response.json(await createOpal(request.body));
});

// Update a specific opal
router.put('/:opalID', async (request, response) => {
    let opalDetails = {
        opalID: request.params.opalID,
        updatedData: request.body
    };

    response.json(await updateOpal(opalDetails));
});

// Delete a specific opal
router.delete('/:opalID', async (request, response) => {
    response.json(await deleteOpal(request.params.opalID));
});

// Export the router so that other files can use it:
module.exports = router;