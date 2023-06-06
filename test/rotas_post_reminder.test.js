const request = require('supertest');
const app = require('../routes/reminders'); // Arquivo de rotas

describe('Testes de rotas POST', () => {
  it('POST new Reminder', async () => {//Deve retornar status 401 pois o token passado é invalido
    const response = await request('http://localhost:3000/reminders')
      .post('/') // Rota POST
      .send(
        {
          Authorization: 'false',
          user_id: '1',
          medicine: 'medicine',
          startDate: 'startDate',
          endDate: 'endDate',
          time: 'time',
          frequency: 'frequency',
        }); // Dados a serem enviados no corpo da requisição
    expect(response.status).toBe(401);
  });
});