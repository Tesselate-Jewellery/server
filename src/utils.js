// Import JWT
const jwt = require('jsonwebtoken');

// Import the model/s we need for the utility functions
const { Role } = require('./models/RoleModel');
const { User } = require('./models/UserModel');

// Import functions necessary 
const { verifyUserJWT, decryptString } = require('./controllers/UserFunctions');


// Function to get the ObjectId for a role name
async function getRoleId(roleName) {
    const role = await Role.findOne({ name: roleName });
    return role ? role._id : null;
}

// Make sure the JWT available in the headers is valid,
// and refresh it to keep the JWT usable for longer.
const verifyJwtHeader = async (request, response, next) => {
    let rawJwtHeader = request.headers.jwt;

    let jwtRefresh = await verifyUserJWT(rawJwtHeader);

    request.headers.jwt = jwtRefresh;

    next();
}

const verifyJwtRole = async (request, response, next) => {
    try {
        // Verify that the JWT is still valid.
        let userJwtVerified = jwt.verify(request.headers.jwt, process.env.JWT_SECRET, { complete: true });
        // Decrypt the encrypted payload.
        let decryptedJwtPayload = decryptString(userJwtVerified.payload.data);
        // Parse the decrypted data into an object.
        let userData = JSON.parse(decryptedJwtPayload);

        // Set user ID in the request headers
        request.headers.userID = userData.userID;
    
        // Because the JWT doesn't include role info, we must find the full user document first:
        let userDoc = await User.findById(userData.userID).exec();
        let userRoleName = await Role.findById(userDoc.role).exec();
    
        // Attach the role to the request for the backend to use.
        // Note that the user's role will never be available on the front-end
        // with this technique.
        // This means they can't just manipulate the JWT to access admin stuff.
        console.log("User role is: " + userRoleName.name);
        request.headers.userRole = userRoleName.name;
    
        next();
    } catch (error) {
        // Handle the error, log it and send an error response.
        console.error("Error in verifyJwtRole middleware:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
}

// The actual authorization middleware.
// Throw to the error-handling middleware
// if the user is not authorized.
// ADMIN authorization only 
const onlyAllowAdmins = (request, response, next) => {
    if (request.headers.userRole == "admin"){
        next(); 
    } else {
        // Send a JSON error response
        response.status(403).json({error:"User not authorized"});
    }
}

// ADMIN and STAFF authorization only 
const onlyAllowAdminsAndStaff = (request, response, next) => {
    if (request.headers.userRole == "admin" || request.headers.userRole == "staff"){
        next(); 
    } else {
        // Send a JSON error response
        response.status(403).json({error:"User not authorized"});
    }
}

module.exports = {
    getRoleId, verifyJwtHeader, verifyJwtRole, 
    onlyAllowAdmins, onlyAllowAdminsAndStaff
}
