'use strict'

const Schema = use('Schema')

class CountriesTableSchema extends Schema {

  up () {
    this.create('countries', (table) => {
      table.increments()
      table.timestamps()
      table.string('name',100).unique().notNullable()
    })
  }

  down () {
    this.drop('countries')
  }

}

module.exports = CountriesTableSchema
