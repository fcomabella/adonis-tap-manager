'use strict'

const chai = use('chai')
const should = chai.should()
const Db = use('Database')
const Brewer = use('App/Model/Brewer')
const City = use('App/Model/City')
const Country = use('App/Model/Country')
let catalunya = {}
let usa = {}
use('co-mocha')

describe('City model', function () {
  beforeEach(function* () {
    catalunya = yield Country.create({
      name: 'Catalunya'
    })
    usa = yield Country.create({
      name: 'USA'
    })
    yield City.create({
      name: 'Barcelona',
      country_id: catalunya.id
    })
  })

  afterEach(function* () {
    yield Db.table('brewers').delete()
    yield Db.table('cities').delete()
    yield Db.table('countries').delete()
  })

  describe('New city', function () {
    it('Correct model data should save', function* () {
      const escondido = new City()
      escondido.name = 'Escondido'
      escondido.country().associate(usa)
      yield escondido.save()
      escondido.name.should.equal('Escondido')
      escondido.id.should.be.number
      escondido.country_id.should.be.number
      escondido.country_id.should.equal(usa.id)
    })

    it('Empty name should throw RequiredException', function* () {
      try {
        const noName = new City()
        noName.name = ''
        noName.country().associate(usa)
        yield noName.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })

    it('No associated country should throw RequiredException', function* () {
      try {
        const escondido = new City()
        escondido.name = 'Escondido'
        yield escondido.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })

    it('Invalid associated country should throw ModelRelationException', function* () {
      try {
        const unsavedCountry = new Country()
        unsavedCountry.name = 'unsaved'
        const berlin = new City()
        berlin.name = 'Berlin'
        berlin.country().associate(unsavedCountry)
        yield berlin.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('ModelRelationException')
      }
    })

    it('New city name for a country should save', function* () {
      const lleida = new City()
      lleida.name = 'Lleida'
      lleida.country().associate(catalunya)
      yield lleida.save()
      lleida.name.should.equal('Lleida')
      lleida.id.should.be.number
      lleida.country_id.should.be.number
      lleida.country_id.should.be.equal(catalunya.id)
    })

    it('Existing city name for a different country should save', function* () {
      const barcelona = new City()
      barcelona.name = 'Barcelona'
      barcelona.country().associate(usa)
      yield barcelona.save()
      barcelona.name.should.be.equal('Barcelona')
      barcelona.id.should.be.number
      barcelona.country_id.should.be.number
      barcelona.country_id.should.equal(usa.id)
    })

    it('Existing city name for a country should throw UniqueValueException', function* () {
      try {
        const barcelona = new City()
        barcelona.name = 'Barcelona'
        barcelona.country().associate(catalunya)
        yield barcelona.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('UniqueValueException')
      }
    })
  })

  describe('Update city', function () {
    it('Update city name to blank should throw RequiredException', function* () {
      try {
        const barcelona = yield City.findBy('name', 'Barcelona')
        barcelona.name = ''
        yield barcelona.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })

    it('Update city name to an alrady existing name for the country should throw UniqueValueException', function* () {
      try {
        const lleida = new City()
        lleida.name = 'Lleida'
        lleida.country().associate(catalunya)
        yield lleida.save()
        lleida.name = 'Barcelona'
        yield lleida.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('UniqueValueException')
      }
    })
    it('Dissociate city from country should throw RequiredValueException', function* () {
      try {
        const barcelona = yield City.findBy('name', 'Barcelona')
        barcelona.country().dissociate()
        yield barcelona.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })
    it('Update country to valid different model should save', function* () {
      const barcelona = yield City.findBy('name', 'Barcelona')
      barcelona.country().associate(usa)
      yield barcelona.save()
      barcelona.country_id.should.equal(usa.id)
      barcelona.country().associate(catalunya)
      yield barcelona.save()
    })
    it('Update country to invalid should throw ModelRelationException', function* () {
      try {
        const unsavedCountry = new Country()
        unsavedCountry.name = 'unsaved'
        const barcelona = yield City.findBy('name', 'Barcelona')
        barcelona.country().associate(unsavedCountry)
        yield barcelona.save()
        should.equal(true, false)
      } catch (ex) {
        ex.name.should.equal('ModelRelationException')
      }
    })
  })

  describe('Delete city', function () {
    it('City whitout associated brewers should delete', function* () {
      try {
        const newCity = new City()
        newCity.name = 'New city';
        newCity.country().associate(catalunya)
        yield newCity.save()
        yield newCity.delete()
      } catch (ex) {
        ex.should.be.undefined()
      }
    })
    it('City with associated brewers should throw Error', function* () {
      try {
        const barcelona = yield City.findBy('name', 'Barcelona')
        const newBrewer = new Brewer()
        newBrewer.name = 'new brewer'
        newBrewer.city().associate(barcelona)
        yield newBrewer.save()
        yield barcelona.delete()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('Error')
      }
    })
  })
})
