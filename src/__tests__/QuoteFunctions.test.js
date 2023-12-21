const mongoose = require('mongoose');
const { getAllQuotes } = require('../controllers/QuoteFunctions');
const { Quote } = require('../models/QuoteModel');
const { User } = require('../models/UserModel');
const { Opal } = require('../models/OpalModel');

describe('Quote Controller Tests', () => {
  let user1, user2, opal1, opal2;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");

    // Insert test data for User and Opal
    user1 = await User.create({ username: 'user1', email: 'user1@email.com', password: 'password1' });
    user2 = await User.create({ username: 'user2', email: 'user2@email.com', password: 'password2' });

    opal1 = await Opal.create({ color: 'Blue', weight: 5.2 });
    opal2 = await Opal.create({ color: 'Green', weight: 7.5 });

    // Ensure a clean database state before running the tests
    await Quote.deleteMany({});
  });

  afterAll(async () => {
    // Clean up after all tests are done
    await Quote.deleteMany({});
    await User.deleteMany({});
    await Opal.deleteMany({});
    await mongoose.disconnect();
  });

  it('should get all quotes', async () => {
    // Create some test quotes
    const quotes = [
      { text: 'Quote 1', createdBy: user1._id, opal: opal1._id },
      { text: 'Quote 2', createdBy: user2._id, opal: opal2._id },
    ];

    await Quote.insertMany(quotes);

    const result = await getAllQuotes();

    expect(result).toHaveLength(quotes.length);
    expect(result[0].text).toBe(quotes[0].text);
    expect(result[1].text).toBe(quotes[1].text);
  });
});