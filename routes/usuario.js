const express = require('express')
const bcrypt = require('bcrypt')

const db = require('../models/db')

const routes_user = express.Router()
const collectionName = 'Usuario' // Nome da coleção no MongoDB


// Rota para criar um novo usuário
routes_user.post('/create_user', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()

    const { nome, sobrenome, email, senha } = req.body

    const collection = db.collection(collectionName)

    const result = await collection.insertOne(
      {
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        senha: await bcrypt.hash(senha, salt)
      }
    )

    res.status(201).json(result)
  } catch (error) {
    console.error('Erro ao criar usuário', error)
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})

// Rota para obter todos os usuários
routes_user.get('/get_all_users', async (req, res) => {
  try {

    const collection = db.collection(collectionName)

    const users = await collection.find({}).toArray()

    res.json(users)
  } catch (error) {
    console.error('Erro ao obter usuários', error)
    res.status(500).json({ error: 'Erro ao obter usuários' })
  }
})

routes_user.post('/login', async (req, res) => {
  const collection = db.collection(collectionName)

  const user = await collection.findOne({ name: req.body.name })

  if (user == null) {
    return res.status(400).send('Cannot find user')
  }

  const result = await bcrypt.compare(req.body.senha, user.senha)
  if (result) {
    res.status(200).send('Success')
  } else {
    res.status(200).send('Not Allowed')
  }

})

module.exports = routes_user