const mongoose = require('mongoose');
const { Quote } = require('../models/QuoteModel');
const { Opal } = require('../models/OpalModel');
const { User } = require('../models/UserModel');

describe('Quote Model Tests', () => {
    let userId;
    let opalId;

    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");

        // Clean up database before testing (quotes, opals, and users)
        await Quote.deleteMany({});
        await Opal.deleteMany({});
        await User.deleteMany({});

        // Create a user
        const user = new User({
            email: 'quotetest@email.com',
            username: 'test user',
            password: 'password123',
        });
        const savedUser = await user.save();
        userId = savedUser._id;

        // Create an opal
        const opalData = {
            name: 'Rainbow Jest Test',
            dimensions: '7x4mm',
            weight: 1.3,
            origin: "Coober Pedy, SA",
            brightness: "3/5",
            tone: "N8",
            pricing: 699,
            image: "test.url",
            createdBy: userId,
        };
        const opal = new Opal(opalData);
        const savedOpal = await opal.save();
        opalId = savedOpal._id;
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create a new quote', async () => {
        const quoteData = {
            metal: 'Silver',
            setting: 'claw',
            ringSize: 'U',
            pricing: 1299,
            opal: opalId,
            createdBy: userId,
        };

        const quote = new Quote(quoteData);
        const savedQuote = await quote.save();

        expect(savedQuote._id).toBeDefined();
        expect(savedQuote.metal).toBe(quoteData.metal);
        expect(savedQuote.setting).toBe(quoteData.setting);
        expect(savedQuote.ringSize).toBe(quoteData.ringSize);
        expect(savedQuote.pricing).toBe(quoteData.pricing);
        expect(savedQuote.opal.toString()).toBe(quoteData.opal.toString()); // ObjectId comparison
        expect(savedQuote.createdBy.toString()).toBe(quoteData.createdBy.toString()); // ObjectId comparison
    });
});