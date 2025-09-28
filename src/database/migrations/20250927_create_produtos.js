
{ import("knex").Knex }

export function up(knex) {
  return knex.schema
    .createTable('marcas', (table) => {
        table.increments('id').primary();
        table.string('nome', 100).notNullable();
        table.string('preco', 100);
        table.string('estoque', 15);
        table.string('id_marca', 15);
    });
}


{ import("knex").Knex } knex

 
export function down(knex) {
  return knex.schema
    .dropTable('marcas');
}