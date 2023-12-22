const mongoose = require('mongoose');
const { User } = require('../models/UserModel');

describe('User Model Tests', () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/Tesselate-API-test");
    // Clean up database before testing (users)
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@email.com',
      username: 'testuser',
      password: 'password123',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.username).toBe(userData.username);
  });
});