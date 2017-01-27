'use strict'

const Lucid = use('Lucid')

class Brewer extends Lucid {
  static boot() {
    super.boot()
    this.addHook('beforeCreate', 'Brewer.validate')
    this.addHook('beforeUpdate', 'Brewer.validate')
  }

  city() {
    return this.belongsTo('App/Model/City')
  }

  beers() {
    return this.hasMany('App/Model/Beer')
  }
}

module.exports = Brewer
