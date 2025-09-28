const Fastify = require('fastify');
const knex = require('./db');
const marcasRoutes = require('./routes/marcas');
const produtosRoutes = require('./routes/produtos');
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');

const fastify = Fastify({ logger: true });

fastify.decorate('knex', knex);

fastify.register(marcasRoutes);
fastify.register(produtosRoutes);
fastify.register(clientesRoutes);
fastify.register(pedidosRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT ? Number(process.env.PORT) : 3000, host: '0.0.0.0' });
    fastify.log.info(`Server rodando na porta ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
