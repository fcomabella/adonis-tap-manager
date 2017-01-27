'use strict'

const Schema = use('Schema')

class MonitorsTapsTableSchema extends Schema {

  up () {
    this.create('monitors_taps', (table) => {
      table.increments()
      table.timestamps()
      table.integer('monitor_id').unsigned().notNullable()
      table.foreign('monitor_id').references('id').inTable('monitors').onDelete('CASCADE')
      table.integer('tap_id').unsigned().notNullable()
      table.foreign('tap_id').references('id').inTable('taps').onDelete('CASCADE')
      table.unique(['monitor_id','tap_id'])
    })
  }

  down () {
    this.drop('monitors_taps')
  }

}

module.exports = MonitorsTapsTableSchema
