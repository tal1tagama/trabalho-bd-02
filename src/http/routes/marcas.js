const fastifyPlugin = require('fastify-plugin');
const { success, fail } = require('../utils/response');

async function marcasRoutes(fastify, opts) {
  const knex = fastify.knex;

  fastify.get('/marcas', async (req, reply) => {
    try {
      const data = await knex('marcas').select('*');
      return reply.code(200).send(success('Marcas listadas', data));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao listar marcas', err.message, 500));
    }
  });

  fastify.get('/marcas/:id', async (req, reply) => {
    try {
      const marca = await knex('marcas').where('id', req.params.id).first();
      if (!marca) return reply.code(404).send(fail('Marca não encontrada', {}, 404));
      return reply.code(200).send(success('Marca encontrada', marca));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao buscar marca', err.message, 500));
    }
  });

  fastify.delete('/marcas/:id', async (req, reply) => {
    try {
      const deleted = await knex('marcas').where('id', req.params.id).del();
      if (!deleted) return reply.code(404).send(fail('Marca não encontrada', {}, 404));
      return reply.code(200).send(success('Marca excluída', {}));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao excluir marca', err.message, 500));
    }
  });
}

module.exports = fastifyPlugin(marcasRoutes);
