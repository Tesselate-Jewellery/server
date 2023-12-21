const mongoose = require('mongoose');
const { Opal } = require('../models/OpalModel');
const { User } = require('../models/UserModel'); // Import the User model

describe('Opal Model Tests', () => {
    let userId; // Variable to store the user ID

    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");

        // Clean up database before testing (opals and users)
        await Opal.deleteMany({});
        await User.deleteMany({});

        // Create a user and get the user ID
        const user = new User({
            email: 'opaltest@email.com',
            username: 'test user',
            password: 'password123',
        });
        const savedUser = await user.save();
        userId = savedUser._id;
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create new opal', async () => {
        const opalData = {
            name: 'Opal test',
            dimensions: '4x4mm',
            weight: 0.9,
            origin: "Coober Pedy, SA",
            brightness: "3/5",
            tone: "N6",
            pricing: 199,
            image: "test.url",
            createdBy: userId, // Provide the user ID
        };

        const opal = new Opal(opalData);
        const savedOpal = await opal.save();

        expect(savedOpal._id).toBeDefined();
        expect(savedOpal.name).toBe(opalData.name);
        expect(savedOpal.dimensions).toBe(opalData.dimensions);
        expect(savedOpal.weight).toBe(opalData.weight);
        expect(savedOpal.origin).toBe(opalData.origin);
        expect(savedOpal.brightness).toBe(opalData.brightness);
        expect(savedOpal.tone).toBe(opalData.tone);
        expect(savedOpal.pricing).toBe(opalData.pricing);
        expect(savedOpal.image).toBe(opalData.image);
        expect(savedOpal.createdBy).toEqual(opalData.createdBy);
    });
});