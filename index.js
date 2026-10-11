const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
});

const Endereco = sequelize.define('Endereco', {
  rua: { type: DataTypes.STRING, allowNull: false },
  numero: { type: DataTypes.STRING, allowNull: false },
  cidade: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.STRING(2), allowNull: false },
  cep: { type: DataTypes.STRING(9), allowNull: false },
});

const Produto = sequelize.define('Produto', {
  nome: { type: DataTypes.STRING, allowNull: false },
  preco: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
  estoque: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
});

const Pedido = sequelize.define('Pedido', {
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado'),
    allowNull: false,
    defaultValue: 'pendente',
  },
});

// Tabela intermediária (N:N entre Pedido e Produto) com dados extras
const ItemPedido = sequelize.define('ItemPedido', {
  quantidade: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  precoUnitario: { type: DataTypes.FLOAT, allowNull: false },
});

// 1:N - Usuário tem vários endereços
Usuario.hasMany(Endereco, { foreignKey: { name: 'usuarioId', allowNull: false }, as: 'enderecos', onDelete: 'CASCADE' });
Endereco.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// 1:N - Usuário tem vários pedidos
Usuario.hasMany(Pedido, { foreignKey: { name: 'usuarioId', allowNull: false }, as: 'pedidos', onDelete: 'CASCADE' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// 1:N - Endereço de entrega pode estar em vários pedidos
Endereco.hasMany(Pedido, { foreignKey: 'enderecoId', as: 'pedidos' });
Pedido.belongsTo(Endereco, { foreignKey: 'enderecoId', as: 'enderecoEntrega' });

// N:N - Pedido tem vários produtos e um produto está em vários pedidos
Pedido.belongsToMany(Produto, { through: ItemPedido, foreignKey: 'pedidoId', otherKey: 'produtoId', as: 'produtos' });
Produto.belongsToMany(Pedido, { through: ItemPedido, foreignKey: 'produtoId', otherKey: 'pedidoId', as: 'pedidos' });

module.exports = { sequelize, Usuario, Endereco, Produto, Pedido, ItemPedido };
