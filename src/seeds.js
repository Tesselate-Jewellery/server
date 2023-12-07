const mongoose = require('mongoose');
const { databaseConnector } = require('./database');

// Import the models that we'll seed
const { Role } = require('./models/RoleModel');
const { User } = require('./models/UserModel');
const { Opal } = require('./models/OpalModel');
const { Quote } = require('./models/QuoteModel');

// Ensure this file can read environment variables.
const dotenv = require('dotenv');
dotenv.config();

// Create some raw data for the Roles collection,
// obeying the needed fields from the Role schema.
const roles = [
    {
        name: "admin",
        description: "Administrators have full control over opal listings with the ability to create, read, update, and delete entries. Additionally, they can access and manage all user accounts, including the authority to delete accounts when necessary."
    },
    {
        name: "staff",
        description:"Staff members possess the capability to modify the pricing and specifications of opal listings. Their role focuses on maintaining and updating the details associated with the opals available in the business."
    },
    {
        name:"user",
        description:"Users are required to log in to the system to send a quote to the business. This role emphasises engagement and interaction, allowing users to communicate with the business for personalised quotes and services"
    }
]

// To fill in after creating user data encryption functionality.
const users = [

];

// To fill in after creating users successfully.
const opals = [

];

// To fill in after creating opals successfully.

const quotes = [

];

// Connect to the database.
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/Tesselate-API-test";
        break;
    case "development":
        databaseURL = "mongodb://localhost:27017/Tesselate-API-dev";
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
}

// This functionality is a big promise-then chain.
// This is because it requires some async functionality,
// and that doesn't work without being wrapped in a function.
// Since .then(callback) lets us create functions as callbacks,
// we can just do stuff in a nice .then chain.
databaseConnector(databaseURL).then(() => {
    console.log("Database connected successfully!");
}).catch(error => {
    console.log(`
    Some error occurred connecting to the database! It was: 
    ${error}
    `);
}).then(async () => {
    if (process.env.WIPE == "true"){
        // Get the names of all collections in the DB.
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Empty the data and collections from the DB so that they no longer exist.
        collections.map((collection) => collection.name)
        .forEach(async (collectionName) => {
            mongoose.connection.db.dropCollection(collectionName);
        });
        console.log("Old DB data deleted.");
    }
}).then(async () => {
    // Add new data into the database.
    await Role.insertMany(roles);

    console.log("New DB data created.");
}).then(() => {
    // Disconnect from the database.
    mongoose.connection.close();
    console.log("DB seed connection closed.")
});