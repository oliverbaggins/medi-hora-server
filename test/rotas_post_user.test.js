const request = require('supertest');
const app = require('../routes/usuario'); // Arquivo de rotas

describe('Testes de rotas POST', () => {
  it( async () => {//Deve retornar status 201 ao criar um novo recurso
    const response = await request(app)
      .post('/api/users') // Rota POST
      .send({ data: 'user, password' },); // Dados a serem enviados no corpo da requisição
    expect(response.status).toBe(201);
  });

  

});
