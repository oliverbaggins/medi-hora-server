const express = require('express')
const app = express()
const mongoose = require('mongoose')

const UsuarioSchema = require('./models/models')

const PORT = 3001
const HOST = 'localhost'

const dbUser = 'luizlopesbr'
const dbPassword = 's6U1p3uGjR7KorEZ'

//mongoose.connect('mongodb://mongo_db:27017/subscribers')
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.v0b6oma.mongodb.net/?retryWrites=true&w=majority`)

const db = mongoose.connection
db.on('error', (error) => console.error(error + 'teste'))
db.on('open', () => console.log('Connected to Database'))

// app.use(express.json())

app.get('/', (req, res) => {
  console.log(req)
  res.json('Hello World')
})

 const User = mongoose.model('User', UsuarioSchema);

 const user = new User({
    _id: '3',
    nome: 'João',
    sobrenome: 'João',
    email: 'João@gmail.com',
    senha: '1245678'
  })

  // user.save().then(() => {
    
  //   console.log("Registro salvo!")
  // }).catch(err => {
  //   console.log(err + 'teste2')
  //   console.log(JSON.stringify(user))
  // })




app.listen(PORT, HOST, () => console.log('Server Started'))


