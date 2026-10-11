const crud = require('./crud');
const { Usuario, Endereco, Pedido } = require('../models');

const router = crud(Usuario, { include: [{ model: Endereco, as: 'enderecos' }] });

router.get('/:usuarioId/enderecos', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.usuarioId);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(await usuario.getEnderecos());
  } catch (e) { next(e); }
});

router.post('/:usuarioId/enderecos', async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.usuarioId);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    const endereco = await Endereco.create({ ...req.body, usuarioId: usuario.id });
    res.status(201).json(endereco);
  } catch (e) { next(e); }
});

router.get('/:usuarioId/pedidos', async (req, res, next) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { usuarioId: req.params.usuarioId },
      include: ['produtos', 'enderecoEntrega'],
    });
    res.json(pedidos);
  } catch (e) { next(e); }
});

module.exports = router;
