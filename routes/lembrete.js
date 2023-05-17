const express = require('express');


const router = express.Router();
const collectionName = 'lembrete'; // Nome da coleção no MongoDB

// Rota para criar um novo lembrete
router.post('/users', async (req, res) => {
  try {
    const { remedio, inicio, fim, horario, frequencia,idUsuario } = req.body;

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({ remedio, inicio, fim, horario, frequencia,idUsuario });

    res.status(201).json(result.ops[0]);
  } catch (error) {
    console.error('Erro ao criar usuário', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Rota para obter todos os lembretes
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

