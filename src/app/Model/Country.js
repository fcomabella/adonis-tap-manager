'use strict'

const Lucid = use('Lucid')
class Country extends Lucid {
    static boot() {
        super.boot()
        this.addHook('beforeCreate', 'Country.validate')
        this.addHook('beforeUpdate', 'Country.validate')
    }

    cities () {
      this.hasMany('App/Model/City')
    }
}

module.exports = Country
