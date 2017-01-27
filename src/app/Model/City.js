'use strict'

const Lucid = use('Lucid')

class City extends Lucid {
  static boot() {
    super.boot()
    this.addHook('beforeCreate', 'City.validate')
    this.addHook('beforeUpdate', 'City.validate')
  }

  country() {
    return this.belongsTo('App/Model/Country')
  }

  brewers() {
    return this.hasMany('App/Model/Brewer')
  }
}

module.exports = City
