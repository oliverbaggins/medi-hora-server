const request = require('supertest');
const app = require('../routes/auth'); // Arquivo de rotas

describe('Testes de rotas POST', () => {
  it('POST login' , async () => {//Deve retornar status 200 ao criar um novo recurso
    const response = await request("http://localhost:3000/auth")
      .post('/signup') // Rota POST
      .send({
                "email": "my.mail8@email.com",
                "password": "password"
      }); // Dados a serem enviados no corpo da requisição
    expect(response.status).toBe(200);
  });
});