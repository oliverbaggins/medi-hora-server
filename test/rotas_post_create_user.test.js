
describe('Testes de rotas POST', () => {
  it('/users/create_user', async () => {//Deve retornar status 201 ao criar um novo recurso
    const res = await fetch('http://localhost:3001/users/create_user', {
      method: 'POST',
      url: 'http://localhost:3001/users/create_user',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "nome": "manel2",
        "sobrenome": "soares2",
        "email": "manel_soares2@email.com",
        "senha": "soares123"
      }),
    })
    expect(res.status).toBe(201)
  })
})
