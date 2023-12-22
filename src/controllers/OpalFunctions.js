const {Opal} = require('../models/OpalModel');

// Model.find({}) returns all documents in a collection.
async function getAllOpals(){
    return await Opal.find({}).exec();
}

// Find Opal by ID
async function getOpalById(OpalID){
    return await Opal.findById(OpalID).exec();
}

// Find Opal created by certain user
async function getOpalsByAdmin(userID){
    return await Opal.find({createdBy: userID}).exec();
}

// Create Opal
async function createOpal(opalDetails){
    return await Opal.create(opalDetails);
}

// Update Opal
async function updateOpal(opalDetails){
    // Find opal, update it, return the updated opal data.
    return await Opal.findByIdAndUpdate(opalDetails.opalID, opalDetails.updatedData, {returnDocument: 'after'}).exec();
}

// Delete Opal
async function deleteOpal(opalID){
    return await Opal.findByIdAndDelete(opalID).exec();
}

module.exports = {
    getAllOpals, getOpalById, getOpalsByAdmin, createOpal, updateOpal, deleteOpal
}
