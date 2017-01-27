'use strict'

const chai = use('chai')
const should = chai.should()
const Country = use('App/Model/Country')
use('co-mocha')

describe('Country model', function () {
  beforeEach(function* () {
    yield Country.create({
      name: 'Catalunya'
    })
  })

  afterEach(function* () {
    yield use('Database').table('cities').delete()
    yield use('Database').table('countries').delete()
  })

  describe('Create country', function () {
    describe('Required fields', function () {
      it('Fullfilled name should save', function* () {
        const germany = yield Country.create({
          name: 'Germany'
        })
        germany.name.should.equal('Germany')
        germany.id.should.be.number
      })

      it('Empty name should throw RequiredException', function* () {
        try {
          yield Country.create({
            name: ''
          })
          should.equal(true, false)
        } catch (ex) {
          ex.name.should.equal('RequiredException')
        }
      })
    })

    describe('Unique value fields', function () {
      it('New name should save', function* () {
        const germany = yield Country.create({
          name: 'Germany'
        })
        germany.name.should.equal('Germany')
        germany.id.should.be.number
      })

      it('Existing name should throw UniqueValueException', function* () {
        try {
          yield Country.create({
            name: 'Catalunya'
          })
          should.equal(true, false)
        } catch (ex) {
          ex.name.should.equal('UniqueValueException')
        }
      })
    })
  })

  describe('Update country', function () {
    describe('Required fields', function () {
      it('Empty name should throw RequiredException', function* () {
        const scotland = yield Country.create({
          name: 'Scotland'
        })
        scotland.name = ''
        try {
          yield scotland.save()
          should.equal(true, false)
        } catch (ex) {
          ex.name.should.equal('RequiredException')
        }
      })
    })

    describe('Unique value fields', function () {
      it('Existing name should throw UniqueValueException', function* () {
        const germany = yield Country.create({
          name: 'Germany'
        })
        germany.name = 'Catalunya'
        try {
          yield germany.save()
          should.equal(true, false)
        } catch (ex) {
          ex.name.should.equal('UniqueValueException')
        }
      })

      it('Non existing name should save', function* () {
        const belgium = yield Country.create({
          name: 'Belgium'
        })
        try {
          belgium.name = 'USA'
          yield belgium.save()
          belgium.name.should.match(/USA/)
        } catch (ex) {
          ex.should.be.undefined()
        }
      })
    })
  })

  describe('Delete country', function () {
    it('Country without associated cities should delete', function* () {
      try {
        var newCountry = new Country()
        newCountry.name = 'To delete'
        newCountry.save()
        newCountry.delete()
      } catch (ex) {
        ex.should.be.undefined()
      }
    })

    it('Country with associated cities should throw Error', function*() {
      try {
        var newCountry = new Country()
        newCountry.name = 'To throw'
        yield newCountry.save()
        var associatedCity = new (use('App/Model/City'))
        associatedCity.name='Associated city'
        associatedCity.country().associate(newCountry)
        yield associatedCity.save()
        yield newCountry.delete()
        should.equal(true, false)
      } catch(ex) {
        ex.name.should.equal('Error')
        ex.code.should.equal('ER_ROW_IS_REFERENCED_2')
      }
    })
  })
})