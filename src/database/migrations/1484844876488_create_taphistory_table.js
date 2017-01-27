'use strict'

const Schema = use('Schema')

class TapHistoriesTableSchema extends Schema {

  up () {
    this.create('tap_histories', (table) => {
      table.increments()
      table.timestamps()
      table.integer('tap_id').unsigned().notNullable()
      table.foreign('tap_id').references('id').inTable('taps').onDelete('cascade')
      table.integer('beer_id').unsigned().notNullable()
      table.foreign('beer_id').references('id').inTable('beers')
    })
  }

  down () {
    this.drop('tap_histories')
  }

}

module.exports = TapHistoriesTableSchema
