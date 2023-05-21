const request = require('supertest');
const app = require('../routes/reminder'); // Arquivo de rotas

describe('Testes de rotas POST', () => {
  it( async () => {//Deve retornar status 201 ao criar um novo recurso
    const response = await request(app)
      .post('/api/reminder') // Rota POST
      .send({ data: 'remedio, horario, inicio, fim, frequencia, idUsuario ' },); // Dados a serem enviados no corpo da requisição
    expect(response.status).toBe(201);
  });

  

});
