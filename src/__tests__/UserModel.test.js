const mongoose = require('mongoose');
const { User } = require('../models/UserModel');

describe('User Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");
    // Clean up database before testing (users)
    await User.deleteMany({});
  });

  afterAll(async () => {
    // After all tests disconnect
    await mongoose.disconnect();
  });

  // Test case, should create new user
  it('should create a new user', async () => {
    // Define test user
    const userData = {
      email: 'test@email.com',
      username: 'testuser',
      password: 'password123',
    };

    // Create new User instance with test user data
    const user = new User(userData);
    // Save user to database and await result
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    // Saved user should match the test user email
    expect(savedUser.email).toBe(userData.email);
    // Saved user should match the test username
    expect(savedUser.username).toBe(userData.username);
  });
});