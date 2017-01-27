'use strict'

const Schema = use('Schema')

class CitiesTableSchema extends Schema {

  up () {
    this.create('cities', (table) => {
      table.increments()
      table.timestamps()
      table.string('name',100).notNullable()
      table.integer('country_id').unsigned()
      table.foreign('country_id').references('id').inTable('countries')
      table.unique(['country_id','name'])
    })
  }

  down () {
    this.drop('cities')
  }

}

module.exports = CitiesTableSchema
