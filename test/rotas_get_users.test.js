const request = require('supertest');
const app = require('../routes/usuario'); // Arquivo de rotas

describe('Testes de rotas GET', () => {
  it('/users', async () => { //Deve retornar status 200 ao acessar a rota 
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

});
