'use strict'

const Schema = use('Schema')

class MonitorsTableSchema extends Schema {

  up () {
    this.create('monitors', (table) => {
      table.integer('id').unsigned().notNullable().primary()
      table.timestamps()
    })
  }

  down () {
    this.drop('monitors')
  }

}

module.exports = MonitorsTableSchema
