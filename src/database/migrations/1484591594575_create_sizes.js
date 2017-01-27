'use strict'

const Schema = use('Schema')

class SizesTableSchema extends Schema {

  up() {
    this.create('sizes', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 50).unique().notNullable()
    })
  }

  down() {
    this.drop('sizes')
  }

}

module.exports = SizesTableSchema
