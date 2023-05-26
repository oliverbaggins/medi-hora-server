
describe('Testes de rotas GET', () => {
  it('/get_all_users', async () => { //Deve retornar status 200 ao acessar a rota 
    //const response = await request(app).get('/')
    const res = await fetch('http://localhost:3001/users/get_all_users')
    expect(res.status).toBe(200)
    //expect(response.status).toBe(200)
  })
})
