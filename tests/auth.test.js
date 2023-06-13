const request = require('supertest');
const router = require('../routes/auth'); // Update the path to your API file

describe('API Tests', () => {
  describe('GET /allusers', () => {
    it('should get all users', async () => {
      const response = await request(router).get('/allusers');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('length');
    });
  });

  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const response = await request(router)
        .post('/signup')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('POST /login', () => {
    it('should log in a user', async () => {
      const response = await request(router)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  // Add more test cases for other API endpoints

  describe('DELETE /logout', () => {
    it('should delete a refresh token', async () => {
      const response = await request(router)
        .delete('/logout')
        .set('Authorization', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDc4YjllZGZjMzllN2JhNDhlOWQxMTMiLCJlbWFpbCI6InBhbmRhQHZlcm1lbGhvLmNvbSIsImlhdCI6MTY4NTY0MDg1OSwiZXhwIjoxNjg1NjQwOTc5fQ.kS5qDDBor0jLqeKj16nGKpqUdykDu3aJxe8FMX6HjlY");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Token deleted successfully');
    });
  });
});

