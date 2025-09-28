
{ import("knex").Knex }

export function up(knex) {
  return knex.schema
    .createTable('pedidos', (table) => {
        table.increments('id').primary();
        table.string('data_pedido', 100).notNullable();
        table.string('id_cliente', 100);
        table.string('valor_total', 15);
    });
}


{ import("knex").Knex } knex

 
export function down(knex) {
  return knex.schema
    .dropTable('pedidos');
}