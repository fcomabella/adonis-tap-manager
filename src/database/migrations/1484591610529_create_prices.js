'use strict'

const Schema = use('Schema')

class PricesTableSchema extends Schema {

  up () {
    this.create('prices', (table) => {
      table.increments()
      table.timestamps()
      table.integer('beer_id').unsigned().notNullable()
      table.foreign('beer_id').references('id').inTable('beers').onDelete('CASCADE')
      table.integer('size_id').unsigned().notNullable()
      table.foreign('size_id').references('id').inTable('sizes').onDelete('CASCADE')
      table.unique(['beer_id','size_id'])
      table.decimal('price', 12, 2).notNullable()
    })
  }

  down () {
    this.drop('prices')
  }

}

module.exports = PricesTableSchema
