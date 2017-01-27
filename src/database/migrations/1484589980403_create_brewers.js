'use strict'

const Schema = use('Schema')

class BrewersTableSchema extends Schema {

  up () {
    this.create('brewers', (table) => {
      table.increments()
      table.timestamps()
      table.string('name',100).unique().notNullable()
      table.integer('city_id').unsigned()
      table.foreign('city_id').references('id').inTable('cities')
    })
  }

  down () {
    this.drop('brewers')
  }

}

module.exports = BrewersTableSchema
