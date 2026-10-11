const crud = require('./crud');
const { Endereco, Usuario } = require('../models');

module.exports = crud(Endereco, { include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome'] }] });
