import("knex").Knex 

export async function seed(knex) {
  await knex('itens_pedidos').del()
  await knex('itens_pedidos').insert([
    {id: 1, id_produto: '3', quantidade: '1', preco_unitario: '7299'},
    {id: 1, id_produto: '4', quantidade: '1', preco_unitario: '4599'},
    {id: 2, id_produto: '5', quantidade: '1', preco_unitario: '7599'},
    {id: 2, id_produto: '6', quantidade: '1', preco_unitario: '5999'},
    {id: 3, id_produto: '10', quantidade: '1', preco_unitario: '6599'},
    {id: 3, id_produto: '11', quantidade: '1', preco_unitario: '5899'},
    {id: 4, id_produto: '12', quantidade: '1', preco_unitario: '3999'},
    {id: 4, id_produto: '13', quantidade: '1', preco_unitario: '1299'},
 
]);
}