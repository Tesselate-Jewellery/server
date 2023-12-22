const mongoose = require('mongoose');
const { databaseConnector } = require('./database');

// Import the models that we'll seed
const { Role } = require('./models/RoleModel');
const { User } = require('./models/UserModel');
const { Opal } = require('./models/OpalModel');
const { Quote } = require('./models/QuoteModel');

// Ensure this file can read environment variables.
const dotenv = require('dotenv');
const { hashString } = require('./controllers/UserFunctions');

// Import utils
const { getRoleId } = require('./utils')
const { getUserId } = require('./utils')

dotenv.config();

// Create some raw data for the Roles collection,
// obeying the needed fields from the Role schema.

// ROLES SEED
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

// USERS SEED
const users = [
    {
        username: "admin1",
        email: "admin1@email.com",
        password: "123456",
        role: null
    },
    {
        username: "admin2",
        email: "admin2@email.com",
        password: "123456",
        role: null
    },
    {
        username: "staff1",
        email: "staff1@email.com",
        password: "123456",
        role: null
    },
    {
        username: "user1",
        email: "user1@email.com",
        password: "abcdef",
        role: null
    },
    {
        username: "user2",
        email: "user2@email.com",
        password: "1ab2c3",
        role: null
    },
];

// OPALS SEED
const opals = [
    {
        name: "Orange Rainbow Opal",
        dimensions: "9x7mm",
        weight: 1.05,
        origin: "Coober Pedy, South Australia",
        brightness: "3.5/5",
        tone: "N8",
        pricing: 540,
        image: "/assets/opal_1.jpg",
        createdBy: null
    },
    {
        name: "Blue Rainbow Opal",
        dimensions: "3x4mm",
        weight: 0.75,
        origin: "Coober Pedy, South Australia",
        brightness: "4/5",
        tone: "N/A",
        pricing: 799,
        image: "/assets/opal_2.jpg",
        createdBy: null
    },
    {
        name: "Green River Opal",
        dimensions: "6x9mm",
        weight: 1.00,
        origin: "Coober Pedy, South Australia",
        brightness: "4.5/5",
        tone: "N9",
        pricing: 999,
        image: "/assets/opal_3.jpg",
        createdBy: null
    },
    {
        name: "Pastel Dove Opal",
        dimensions: "10x14mm",
        weight: 1.23,
        origin: "Coober Pedy, South Australia",
        brightness: "3/5",
        tone: "N4",
        pricing: 1220,
        image: "/assets/opal_4.jpg",
        createdBy: null
    },
    {
        name: "Faded Fire Opal",
        dimensions: "4x7mm",
        weight: 0.85,
        origin: "Coober Pedy, South Australia",
        brightness: "2/5",
        tone: "N/A",
        pricing: 199,
        image: "/assets/opal_5.jpg",
        createdBy: null
    },
    {
        name: "Brilliant Rainbow Opal",
        dimensions: "6x7mm",
        weight: 1.00,
        origin: "Coober Pedy, South Australia",
        brightness: "5/5",
        tone: "N9",
        pricing: 1645,
        image: "/assets/opal_6.jpg",
        createdBy: null
    },
    {
        name: "White Mystic Opal",
        dimensions: "10x12mm",
        weight: 1.13,
        origin: "Coober Pedy, South Australia",
        brightness: "3.5/5",
        tone: "N/A",
        pricing: 545,
        image: "/assets/opal_7.jpg",
        createdBy: null
    },
    {
        name: "Pastel Dove Opal",
        dimensions: "10x14mm",
        weight: 1.23,
        origin: "Coober Pedy, South Australia",
        brightness: "3/5",
        tone: "N4",
        pricing: 1220,
        image: "/assets/opal_8.jpg",
        createdBy: null
    },
];

// QUOTES SEED
const quotes = [
    {
        metal: "Silver",
        setting: "claw",
        ringSize: "U",
        pricing: 1299,
        opal: null,
        createdBy: null
    },
    {
        metal: "9ct Gold",
        setting: "claw",
        ringSize: "O",
        pricing: 1499,
        opal: null,
        createdBy: null
    },
    {
        metal: "18ct Gold",
        setting: "bezel",
        ringSize: "P",
        pricing: 1899,
        opal: null,
        createdBy: null
    },
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
    // Allow variables to be used by local scopes
    const adminUsernames = ["admin1", "admin2"]
    const opalNames = ["orange rainbow opal", "blue mint opal", "red horizon opal"]
    
    // Add new data into the database.
    // Store the new documents as a variable for use later.
    let rolesCreated = await Role.insertMany(roles);
      
    // Iterate through the users array, using for-of to enable async/await.
    for (const user of users) {
         // Hash the password
         user.password = await hashString(user.password);

        // Set the role for each user
        switch (user.username) {
            case "admin1": 
            case "admin2": 
                user.role = await getRoleId("admin")
                break;
            case "staff1": 
                user.role = await getRoleId("staff")
                break;
            case "user1": 
            case "user2":
                user.role = await getRoleId("user");
                break;
        }
    }

    let usersCreated = await User.insertMany(users);

    // Iterate through the opals array, using for-of to enable async/await.
    for (const opal of opals) {

        const randomAdminId = usersCreated
        .filter(user => adminUsernames.includes(user.username))
        .map(user => user.id)
        [Math.floor(Math.random() * adminUsernames.length)];

        // Assign randomly selected admin ID to the createdBy Opal field
        opal.createdBy = randomAdminId;
    }

     // Then save the opals to the database.
     let opalsCreated = await Opal.insertMany(opals);

    // Iterate through the quotes array, using for-of to enable async/await.
    for (const quote of quotes) {


        // Pick a random user and assign that user as the creator of the quote
        quote.createdBy = usersCreated[Math.floor(Math.random() * usersCreated.length)].id

        const randomOpalId = opalsCreated
        .filter(opal => opalNames.includes(opal.name))
        .map(opal => opal.id)
        [Math.floor(Math.random() * opalNames.length)];
;
        // Assign randomly selected opal ID to the opal field 
        quote.opal = randomOpalId
    }

    // Then save the quotes to the database.
    let quotesCreated = await Quote.insertMany(quotes);

    // Log modified to list all data created.
    console.log("New DB data created.\n" + JSON.stringify({roles: rolesCreated, users: usersCreated, opals: opalsCreated, quotes: quotesCreated}, null, 4));
}).then(() => {
    // Disconnect from the database.
    mongoose.connection.close();
    console.log("DB seed connection closed.")
});