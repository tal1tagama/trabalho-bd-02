const fastifyPlugin = require('fastify-plugin');
const { success, fail } = require('../utils/response');

async function pedidosRoutes(fastify, opts) {
  const knex = fastify.knex;

  async function getItensByPedido(pedidoId) {
    return knex('itens_pedidos as ip')
      .select('ip.*', 'p.nome as produto_nome')
      .leftJoin('produtos as p', 'ip.produto_id', 'p.id')
      .where('ip.pedido_id', pedidoId);
  }

  fastify.get('/pedidos', async (req, reply) => {
    try {
      const pedidos = await knex('pedidos').select('*');
      const pedidosComItens = await Promise.all(pedidos.map(async ped => {
        const itens = await getItensByPedido(ped.id);
        return { ...ped, itens };
      }));
      return reply.code(200).send(success('Pedidos listados', pedidosComItens));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao listar pedidos', err.message, 500));
    }
  });


  fastify.get('/pedidos/:id', async (req, reply) => {
    try {
      const id = req.params.id;
      const pedido = await knex('pedidos').where('id', id).first();
      if (!pedido) return reply.code(404).send(fail('Pedido não encontrado', {}, 404));
      const itens = await getItensByPedido(id);
      return reply.code(200).send(success('Pedido encontrado', { ...pedido, itens }));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao buscar pedido', err.message, 500));
    }
  });

  fastify.get('/pedidos/cidade/:cidade', async (req, reply) => {
    try {
      const cidade = req.params.cidade;
      const pedidos = await knex('pedidos as pd')
        .select('pd.*', 'c.cidade as cidade_cliente', 'c.nome as cliente_nome')
        .leftJoin('clientes as c', 'pd.cliente_id', 'c.id')
        .where('c.cidade', cidade);

      const pedidosComItens = await Promise.all(pedidos.map(async ped => {
        const itens = await getItensByPedido(ped.id);
        return { ...ped, itens };
      }));

      return reply.code(200).send(success(`Pedidos na cidade ${cidade}`, pedidosComItens));
    } catch (err) {
      return reply.code(500).send(fail('Erro ao buscar pedidos por cidade', err.message, 500));
    }
  });

  fy.post('/pedidos', async (req, reply) => {
    const trx = await knex.transaction();
    try {
      const { cliente_id, status = 'pendente', itens } = req.body;
      if (!cliente_id || !Array.isArray(itens) || itens.length === 0) {
        await trx.rollback();
        return reply.code(412).send(fail('Dados incompletos: cliente_id e itens são obrigatórios', {}, 412));
      }

      let valor_total = 0;
      const itensParaInserir = itens.map(it => {
        const subtotal = Number((it.preco_unitario * it.quantidade).toFixed(2));
        valor_total += subtotal;
        return {
          produto_id: it.produto_id,
          quantidade: it.quantidade,
          preco_unitario: it.preco_unitario,
          subtotal
        };
      });

      const [pedidoId] = await trx('pedidos').insert({
        cliente_id,
        status,
        valor_total
      });

      const itensComPedido = itensParaInserir.map(it => ({ ...it, pedido_id: pedidoId }));
      await trx('itens_pedidos').insert(itensComPedido);

      await trx.commit();

      const novoPedido = await knex('pedidos').where('id', pedidoId).first();
      const itensInseridos = await getItensByPedido(pedidoId);

      return reply.code(201).send(success('Pedido criado com sucesso', { ...novoPedido, itens: itensInseridos }));
    } catch (err) {
      await trx.rollback();
      return reply.code(500).send(fail('Erro ao criar pedido', err.message, 500));
    }
  });
}

module.exports = fastifyPlugin(pedidosRoutes);
