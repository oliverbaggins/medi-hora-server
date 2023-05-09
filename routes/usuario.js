const express = require('express');


const router = express.Router();
const collectionName = 'User'; // Nome da coleção no MongoDB

// Rota para criar um novo usuário
router.post('/users', async (req, res) => {
  try {
    const { _id, nome, sobrenome, email, senha  } = req.body;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({ _id, nome, sobrenome, email, senha });

    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Erro ao criar usuário', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para obter todos os usuários
router.get('/users', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const users = await collection.find({}).toArray();

    res.json(users);
  } catch (error) {
    console.error('Erro ao obter usuários', error);
    res.status(500).json({ error: 'Erro ao obter usuários' });
  }
});

