const {Opal} = require('../models/OpalModel');

// Model.find({}) returns all documents in a collection.
async function getAllOpals(){
    return await Opal.find({}).exec();
}

async function getOpalById(OpalID){
    return await Opal.findById(OpalID).exec();
}

async function getPostsByAdmin(userID){
    return await Opal.find({createdBy: userID}).exec();
}

async function createOpal(OpalDetails){
    return await Opal.create(OpalDetails);
}

async function updateOpal(opalDetails){
    // Find opal, update it, return the updated opal data.
    return await Opal.findByIdAndUpdate(opalDetails.opalID, opalDetails.updatedData, {returnDocument: 'after'}).exec();
}

async function deleteOpal(opalID){
    return await Opal.findByIdAndDelete(opalID).exec();
}

module.exports = {
    getAllOpals, getOpalById, getOpalsByAdmin, createOpal, updateOpal, deleteOpal
}
