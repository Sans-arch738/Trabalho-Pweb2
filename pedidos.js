const express = require('express');
const { sequelize, Pedido, Produto, Usuario, Endereco, ItemPedido } = require('../models');

const router = express.Router();

const include = [
  { model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] },
  { model: Endereco, as: 'enderecoEntrega' },
  { model: Produto, as: 'produtos', through: { attributes: ['quantidade', 'precoUnitario'] } },
];

// LISTAR
router.get('/', async (req, res, next) => {
  try {
    res.json(await Pedido.findAll({ include }));
  } catch (e) { next(e); }
});

// BUSCAR POR ID
router.get('/:id', async (req, res, next) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, { include });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (e) { next(e); }
});

// CRIAR
router.post('/', async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { usuarioId, enderecoId, itens } = req.body;
    if (!Array.isArray(itens) || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({ erro: 'Informe ao menos um item em "itens"' });
    }

    const endereco = await Endereco.findByPk(enderecoId, { transaction: t });
    if (!endereco || endereco.usuarioId !== Number(usuarioId)) {
      await t.rollback();
      return res.status(400).json({ erro: 'Endereço inexistente ou não pertence ao usuário' });
    }

    const pedido = await Pedido.create({ usuarioId, enderecoId }, { transaction: t });

    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId, { transaction: t });
      if (!produto) throw Object.assign(new Error(`Produto ${item.produtoId} não existe`), { status: 400 });
      if (produto.estoque < item.quantidade) {
        throw Object.assign(new Error(`Estoque insuficiente para "${produto.nome}"`), { status: 400 });
      }
      await ItemPedido.create(
        { pedidoId: pedido.id, produtoId: produto.id, quantidade: item.quantidade, precoUnitario: produto.preco },
        { transaction: t }
      );
      await produto.update({ estoque: produto.estoque - item.quantidade }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(await Pedido.findByPk(pedido.id, { include }));
  } catch (e) {
    await t.rollback();
    next(e);
  }
});

// ATUALIZAR 
router.put('/:id', async (req, res, next) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    const { status, enderecoId } = req.body;
    await pedido.update({ status, enderecoId });
    res.json(await Pedido.findByPk(pedido.id, { include }));
  } catch (e) { next(e); }
});

// APAGAR
router.delete('/:id', async (req, res, next) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    await ItemPedido.destroy({ where: { pedidoId: pedido.id } });
    await pedido.destroy();
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
