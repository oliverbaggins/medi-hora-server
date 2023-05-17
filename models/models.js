const mongoose = require('mongoose');

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
    required: true,
  },
  idUsuario: {
    type: String,
    required: true
  }
});

const HistoricoSchema = new mongoose.Schema({
  lembrete: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lembrete',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
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
  Tomou: { 
    type: Boolean,
    required: true,
    default: false 
  },
  DataTomou: { 
    type: Date, 
    required: true 
  },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

const Lembrete = mongoose.model('Lembrete', LembreteSchema);

const Historico = mongoose.model('Historico', HistoricoSchema);

module.exports = {
  Usuario,
  Lembrete,
  Historico,
};

