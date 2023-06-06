const request = require('supertest');
const app = require('../routes/auth'); // Arquivo de rotas

describe('Testes de rotas GET', () => {
  it('/users', async () => { //Deve retornar status 200 ao acessar a rota 
    const response = await request('http://localhost:3000/auth').get('/allusers');
    expect(response.status).toBe(200);
  });
});