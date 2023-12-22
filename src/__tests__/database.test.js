const mongoose = require('mongoose');
const { databaseConnector, databaseDisconnector } = require('../database');

// Use a mock for the actual connection and close methods of mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn()
  }
}));

describe('Database Connector and Disconnector Tests', () => {
  // Test for databaseConnector
  it('should connect to the database', async () => {
    const databaseURL = 'mongodb://localhost:27017/Tesselate-API-test';
    await databaseConnector(databaseURL);

    // Expect mongoose.connect to have been called with the specified database URL
    expect(mongoose.connect).toHaveBeenCalledWith(databaseURL);
  });

  // Test for databaseDisconnector
  it('should close the database connection', async () => {
    await databaseDisconnector();

    // Expect mongoose.connection.close to have been called
    expect(mongoose.connection.close).toHaveBeenCalled();
  });
});