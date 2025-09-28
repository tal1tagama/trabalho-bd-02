import("knex").Knex 

export async function seed(knex) {
  await knex('itens_pedidos').del()
  await knex('itens_pedidos').insert([
    {id: 1, data_pedido: '2025-09-17', id_cliente: '1', valor_total: '11898'},
    {id: 2, data_pedido: '2025-09-17', id_cliente: '2', valor_total: '13598'},
    {id: 3, data_pedido: '2025-09-17', id_cliente: '3', valor_total: '12498'},
    {id: 4, data_pedido: '2025-09-17', id_cliente: '4', valor_total: '5298'},

]);
}