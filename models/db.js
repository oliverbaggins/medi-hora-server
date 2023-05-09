const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27017/simedic';

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro na conexão com o banco de dados:'));
db.once('open', function() {
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
});
