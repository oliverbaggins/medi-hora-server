const request = require('supertest');
const app = require('../routes/auth');

describe('Authentication API', () => {
  let accessToken = '';

  // Run this block of code before each test case
  beforeEach(async () => {
    // Clear any existing access token
    accessToken = '';

    // Perform login and get access token
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
      
    accessToken = response.body.accessToken;
  });

  describe('POST /signup', () => {
    test('should create a new user', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
    });

    test('should return an error if the user already exists', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('This user already exists');
    });

    // Add more test cases for invalid email, weak password, etc.
  });

  describe('POST /login', () => {
    test('should log in a user and return access token', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    test('should return an error for invalid password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'incorrectpassword'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid password');
    });

    // Add more test cases for non-existent email, missing password, etc.
  });

  // Add more describe blocks and test cases for other endpoints

});
