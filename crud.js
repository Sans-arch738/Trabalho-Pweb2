const express = require('express');

module.exports = function crud(Model, { include = [] } = {}) {
  const router = express.Router();

  // LISTAR
  router.get('/', async (req, res, next) => {
    try {
      res.json(await Model.findAll({ include }));
    } catch (e) { next(e); }
  });

  // BUSCAR POR ID
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id, { include });
      if (!item) return res.status(404).json({ erro: 'Registro não encontrado' });
      res.json(item);
    } catch (e) { next(e); }
  });

  // CRIAR
  router.post('/', async (req, res, next) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (e) { next(e); }
  });

  // ATUALIZAR
  router.put('/:id', async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ erro: 'Registro não encontrado' });
      await item.update(req.body);
      res.json(item);
    } catch (e) { next(e); }
  });

  // APAGAR
  router.delete('/:id', async (req, res, next) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ erro: 'Registro não encontrado' });
      await item.destroy();
      res.status(204).send();
    } catch (e) { next(e); }
  });

  return router;
};
