const request = require('supertest');
const { app } = require('../server');

describe('Server Tests', () => {
    it('should return "Hello world!" at /', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Hello world!');
    });
  
    it('should return database health information at /databaseHealth', async () => {
      const response = await request(app).get('/databaseHealth');
      expect(response.statusCode).toBe(200);
    });
  
    it('should return database dump at /databaseDump', async () => {
      const response = await request(app).get('/databaseDump');
      expect(response.statusCode).toBe(200);
    });
  
    it('should handle 404 for undefined routes', async () => {
      const response = await request(app).get('/undefinedRoute');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('No route with that path found!');
    });
  });