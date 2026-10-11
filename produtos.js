const crud = require('./crud');
const { Produto } = require('../models');

module.exports = crud(Produto);
