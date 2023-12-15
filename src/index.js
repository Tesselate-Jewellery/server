// Import the configured items from the server file:
var {app, PORT, HOST} = require('./server');

// For Heroku deployment
// Allow the use of environment variable 'PORT' if available (as set by Heroku) or default to 3000
const PORT = process.env.PORT || 3000;


// Run the server
app.listen(PORT, HOST, () => {
    console.log(`
    ExpressJS Tesselate Bespoke Jewellery API is now running!

    Congrats!
    `);
});