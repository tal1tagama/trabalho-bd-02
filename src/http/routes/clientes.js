const fastifyPlugin = require('fastify-plugin');
const { success, fail } = require('../utils/response');

async function clientesRoutes(fastify, opts) {
  const knex = fastify.knex;

  fastify.get('/clientes', async (req, reply) => {
    try {
      const data = await knex('clientes').select('*');
      return reply.code(200).send(success('Clientes listados', data));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao listar clientes', err.message, 500));
    }
  });

  fastify.get('/clientes/:id', async (req, reply) => {
    try {
      const cli = await knex('clientes').where('id', req.params.id).first();
      if (!cli) return reply.code(404).send(fail('Cliente não encontrado', {}, 404));
      return reply.code(200).send(success('Cliente encontrado', cli));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao buscar cliente', err.message, 500));
    }
  });

  fastify.post('/clientes', async (req, reply) => {
    try {
      const { nome, email, telefone = null, cidade = null, endereco = null } = req.body;
      if (!nome || !email) return reply.code(412).send(fail('Dados incompletos', {}, 412));
      const [id] = await knex('clientes').insert({ nome, email, telefone, cidade, endereco });
      const novo = await knex('clientes').where('id', id).first();
      return reply.code(201).send(success('Cliente criado', novo));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao criar cliente', err.message, 500));
    }
  });
}

module.exports = fastifyPlugin(clientesRoutes);
