// Import Express
const express = require('express');
// Create an instance of an Express Router
const router = express.Router();

// Import JWT
const jwt = require('jsonwebtoken');

// Import models as needed
const { Role } = require('../models/RoleModel');
const { User } = require('../models/UserModel');

// Import User functions
const {
    encryptString, decryptString, decryptObject, hashString, validateHashedData, 
    generateJWT, generateUserJWT, verifyUserJWT, 
    getAllUsers, getSpecificUser, createUser, updateUser, deleteUser
} = require('./UserFunctions');

// Import utility functions
const { 
    getRoleId, verifyJwtHeader, verifyJwtRole, onlyAllowAdmins 
} = require('../utils');




// Validate user email uniqueness
const uniqueEmailCheck = async (request, response, next) => {
    let isEmailInUse = await User.exists({email: request.body.email}).exec();
    if (isEmailInUse){
        next(new Error("An account with this email address already exists."));
    } else {
        next();
    }
    
}

// If any errors are detected, end the route early
// and respond with the error message
const handleErrors = async (error, request, response, next) => {
    if (error) {
        response.status(500).json({
            error: error.message
        });
    } else {
        next();
    }
}

// Sign-up a new user
router.post('/sign-up', uniqueEmailCheck, handleErrors, async (request, response) => {
    let userDetails = {
        email: request.body.email,
        password: request.body.password,
        username: request.body.username,
        // Set default to "user", which will be an ObjectID
        roleID: await getRoleId("user")
    }
    let newUserDoc = await createUser(userDetails);

    response.json({
        user: newUserDoc
    });

    // console.log(userDetails);

});

// Sign-in an existing user
router.post('/sign-in', async (request, response) => {
    try {
        let targetUser = await User.findOne({ email: request.body.email }).exec();
        // console.log(targetUser);

        if (targetUser) {
            // User found, proceed with password validation
            if (await validateHashedData(request.body.password, targetUser.password)) {
                let encryptedUserJwt = await generateUserJWT({
                    userID: targetUser.id,
                    email: targetUser.email,
                    password: targetUser.password
                });

            const responseObject = {
                role: targetUser.role,
                jwt: encryptedUserJwt,
                userID: targetUser.id
            }

            response.json(responseObject);

            } else {
                // Password incorrect
                response.status(400).json({ error: "Incorrect user details." });
            }
        } else {
            // User not found
            // Same error message as "password incorrect", so you cannot decipher
            // an email exists in the database through brute force
            response.status(404).json({ error: "Incorrect user details" });
        }
    } catch (error) {
        console.error("Error in sign-in:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// Extend a user's JWT validity
router.post('/token-refresh', async(request, response) => {
    let oldToken = request.body.jwt;
    let refreshResult = await verifyUserJWT(oldToken).catch(error => {return {error: error.message}})
    response.json(refreshResult);
});

// Update a user
router.put('/:userID', verifyJwtHeader, async (request, response) => {
    try{
        let userDetails = {
        userID: request.params.userID,
        updatedData: request.body
    }

    response.json(await updateUser(userDetails));
    } catch (error) {
        response.json({ error: 'An error occurred, please try again!' });
    } 
});

// Delete a user
router.delete('/:userID', verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, async (request, response) => {
    response.json(await deleteUser(request.params.userID));
});

// List all users
router.get('/', verifyJwtHeader, verifyJwtRole, onlyAllowAdmins, async (request, response) => {
    let allUsers = await getAllUsers();

    response.json({
        userCount: allUsers.length,
        usersArray: allUsers
    });
});

// Show a specific user
// Initially wanted to implement only allowing Admins access,
// However, then my username and email fields do not populate in front end
// Find a FIX in the future
router.get('/:userID', verifyJwtHeader, async (request, response) => {
    response.json(await getSpecificUser(request.params.userID));
});

// Export the router so that other files can use it:
module.exports = router;
