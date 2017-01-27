'use strict'

const Schema = use('Schema')

class BeersTableSchema extends Schema {

  up() {
    this.create('beers', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 100).notNullable()
      table.decimal('abv', 3, 1)
      table.integer('style_id').unsigned().notNullable()
      table.foreign('style_id').references('id').inTable('styles')
    })
  }

  down() {
    this.drop('beers')
  }

}

module.exports = BeersTableSchema
