const express = require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = 3000
const HOST = '0.0.0.0'

mongoose.connect('mongodb://mongo_db:27017/subscribers')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected to Database'))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, HOST, () => console.log('Server Started'))


