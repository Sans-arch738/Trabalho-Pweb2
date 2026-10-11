const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ mensagem: 'API da Loja no ar', rotas: ['/usuarios', '/enderecos', '/produtos', '/pedidos'] }));

app.use('/usuarios', require('./routes/usuarios'));
app.use('/enderecos', require('./routes/enderecos'));
app.use('/produtos', require('./routes/produtos'));
app.use('/pedidos', require('./routes/pedidos'));

app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ erro: err.errors.map((e) => e.message) });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ erro: 'Referência inválida (chave estrangeira)' });
  }
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ erro: err.status ? err.message : 'Erro interno do servidor' });
});

module.exports = app;
