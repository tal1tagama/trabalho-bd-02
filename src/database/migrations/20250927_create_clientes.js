{ import("knex").Knex }

export function up(knex) {
  return knex.schema
    .createTable('clientes', (table) => {
        table.increments('id').primary();
        table.string('nome', 100).notNullable();
        table.string('email', 100);
        table.string('cidade', 15);
    });
}


{ import("knex").Knex } knex

 
export function down(knex) {
  return knex.schema
    .dropTable('clientes');
}