const express = require('express')

const routes_user = require('./routes/usuario')
const app = express()

const PORT = 3001
const HOST = 'localhost'

app.use(express.json())

app.get('/', (req, res) => {
  console.log(req)
  res.json('Hello World')
})

app.use('/users', routes_user)

app.listen(PORT, HOST, () => console.log('Server Started'))

