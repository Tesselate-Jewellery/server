// Import the model/s we need for the utility functions
const { Role } = require('./models/RoleModel');
const { User } = require('./models/UserModel');



// Function to get the ObjectId for a role name
async function getRoleId(roleName) {
    const role = await Role.findOne({ name: roleName });
    return role ? role._id : null;
}

module.exports = {
    getRoleId
}
