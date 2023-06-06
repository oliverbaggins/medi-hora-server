const request = require('supertest');
const app = require('../routes/reminders'); // Arquivo de rotas

describe('Testes de rotas GET', () => {
  it('/reminder', async () => { //Deve retornar status 401 ao acessar a rota, pois não esta passando o token de autorização 
    const response = await request('http://localhost:3000/reminders').get('/');
    expect(response.status).toBe(401);
  });
});