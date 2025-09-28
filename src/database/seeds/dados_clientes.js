import("knex").Knex 

export async function seed(knex) {
  await knex('clientes').del()
  await knex('clientes').insert([
    {id: 1, nome: 'Daniel Ventura', email: 'daniel.@email.com', cidade: 'Juiz de Fora'},
    {id: 2, nome: 'Danilu Samuel', email: 'danilu.@email.com', cidade: 'Santana de Cataguases'},
    {id: 3, nome: 'Larissa Da Glória', email: 'larissa.@email.com', cidade: 'Cataguases'},
    {id: 4, nome: 'Lucas Araújo', email: 'lucas.@email.com', cidade: 'Leopoldina'},
    {id: 5, nome: 'João Pedro', email: 'joao.@email.com', cidade: 'Rio de Janeiro'},
    {id: 6, nome: 'Yasmin Dias', email: 'yasmin.@email.com', cidade: 'São Paulo'}

]);
}