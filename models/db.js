const mongoose = require('mongoose')

const DB_URL = 'mongodb+srv://cluster0.5r3re24.mongodb.net'

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: 'usuarioDB',
  pass: 'fipNeuZLAePigot3',
  dbName: 'simedic'
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro na conexão com o banco de dados:'))
db.once('open', function () {
  console.log('Conexão com o banco de dados estabelecida com sucesso!')
})

module.exports = db