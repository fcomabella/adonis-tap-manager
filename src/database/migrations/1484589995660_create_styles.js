'use strict'

const Schema = use('Schema')

class StylesTableSchema extends Schema {

  up() {
    this.create('styles', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 50).unique()
    })
  }

  down() {
    this.drop('styles')
  }

}

module.exports = StylesTableSchema
