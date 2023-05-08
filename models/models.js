const mongoose = require('mongoose');

// Esquema para o usuário
const UsuarioSchema = new mongoose.Schema({
  _id:{
    type: String,
  
  },
  nome: {
    type: String,
    required: true
  },
  sobrenome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    //unique: true,
   
  },
  senha: {
    type: String,
    required: true
  },
});

// Esquema para o lembrete de medicamento
const LembreteSchema = new mongoose.Schema({
    remedio: {
      type: String,
      required: true
    },
    inicio: {
      type: Date,
      required: true
    },
    fim: {
      type: Date,
      required: true
    },
    horario: {
      type: String,
      required: true
    },
    frequencia: {
      type: String,
      enum: ['a cada 4 horas' ,'a cada 6 horas', 'a cada 8 horas', 'a cada 12 horas'],
    },
    idUsuario: {
      type: String,
      required: true
    }
});


 module.exports = UsuarioSchema

// Modelo para o usuário
// const User = mongoose.model('User', UsuarioSchema);

// // Modelo para o lembrete de medicamento
// const Lembrete = mongoose.model('Lembrete', LembreteSchema);

// module.exports = {
//   User,
//   Lembrete,
  
// };
