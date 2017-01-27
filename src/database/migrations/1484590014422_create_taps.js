'use strict'

const Schema = use('Schema')

class TapsTableSchema extends Schema {

  up () {
    this.create('taps', (table) => {
      table.integer('id').unsigned().notNullable().primary()
      table.timestamps()
      table.integer('beer_id').unsigned().nullable()
      table.foreign('beer_id').references('id').inTable('beers').onDelete('SET NULL')
    })
  }

  down () {
    this.drop('taps')
  }

}

module.exports = TapsTableSchema
