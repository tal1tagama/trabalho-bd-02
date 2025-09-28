const fastifyPlugin = require('fastify-plugin');
const { success, fail } = require('../utils/response');

async function produtosRoutes(fastify, opts) {
  const knex = fastify.knex;

  fastify.get('/produtos', async (req, reply) => {
    try {
      const data = await knex('produtos as p')
        .select('p.*', 'm.nome as marca_nome')
        .leftJoin('marcas as m', 'p.marca_id', 'm.id');
      return reply.code(200).send(success('Produtos listados', data));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao listar produtos', err.message, 500));
    }
  });

  fastify.get('/produtos/:id', async (req, reply) => {
    try {
      const prod = await knex('produtos as p')
        .select('p.*', 'm.nome as marca_nome')
        .leftJoin('marcas as m', 'p.marca_id', 'm.id')
        .where('p.id', req.params.id).first();
      if (!prod) return reply.code(404).send(fail('Produto não encontrado', {}, 404));
      return reply.code(200).send(success('Produto encontrado', prod));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao buscar produto', err.message, 500));
    }
  });

  fastify.post('/produtos', async (req, reply) => {
    try {
      const { nome, preco, marca_id, estoque = 0, descricao = null } = req.body;
      if (!nome || !preco || !marca_id) {
        return reply.code(412).send(fail('Dados incompletos', {}, 412));
      }
      const [id] = await knex('produtos').insert({
        nome, preco, marca_id, estoque, descricao
      });
      const novo = await knex('produtos').where('id', id).first();
      return reply.code(201).send(success('Produto criado', novo));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao criar produto', err.message, 500));
    }
  });
}

module.exports = fastifyPlugin(produtosRoutes);
