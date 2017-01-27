'use strict'

const chai = use('chai')
const should = chai.should()
const Db = use('Database')
const Brewer = use('App/Model/Brewer')
const City = use('App/Model/City')
const Country = use('App/Model/Country')
let catalunya = {}
let barcelona = {}
use('co-mocha')

describe('Brewer model', function () {
  beforeEach(function* () {
    catalunya = yield Country.create({
      name: 'Catalunya'
    })
    barcelona = yield City.create({
      name: 'Barcelona',
      country_id: catalunya.id
    })
    yield Brewer.create({
      name: 'Almogàver',
      city_id: barcelona.id
    })
  })

  afterEach(function* () {
    yield Db.table('brewers').delete()
    yield Db.table('cities').delete()
    yield Db.table('countries').delete()
  })

  describe('New brewer', function () {
    it('Should save correct model', function* () {
      try {
        const brewdog = new Brewer()
        brewdog.name = 'Brewdog'
        brewdog.city().associate(barcelona)
        yield brewdog.save()
        brewdog.id.should.be.number
      } catch (ex) {
        should.not.exist(ex)
      }
    })

    it('Brewer whithout name should throw RequiredException', function* () {
      try {
        const noName = new Brewer()
        noName.city().associate(barcelona)
        yield noName.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })

    it('Brewer without city should throw RequiredException', function* () {
      try {
        const noCity = new Brewer()
        noCity.name = 'No city'
        yield noCity.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })

    it('Existing brewer name should throw UniqueValueException', function* () {
      try {
        const almogaver = new Brewer()
        almogaver.name = 'Almogàver'
        almogaver.city().associate(barcelona)
        yield almogaver.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('UniqueValueException')
      }
    })

    it('Brewer with incorrect city should throw ModelRelationException', function* () {
      try {
        const unsavedCity = new City()
        unsavedCity.name = 'Unsaved'
        const brewerInvalidCity = new Brewer()
        brewerInvalidCity.name = 'Invalid city'
        brewerInvalidCity.city().associate(unsavedCity)
        yield brewerInvalidCity.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('ModelRelationException')
      }
    })
  })


  describe('Update brewer', function () {
    it('Change name to an empty value should throw RequiredException', function* () {
      try {
        const almogaver = yield Brewer.findBy('name', 'Almogàver')
        should.exist(almogaver)
        almogaver.name = ''
        yield almogaver.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })

    it('Should update brewer to a new non existing name', function* () {
      try {
        const newBrewer = new Brewer()
        newBrewer.name = 'New brewer'
        newBrewer.city().associate(barcelona)
        yield newBrewer.save()
        newBrewer.name = 'Another brewer'
        yield newBrewer.save()
      } catch (ex) {
        should.not.exist(ex)
      }
    })

    it('Change name to an already existing name should throw UniqueValueException', function* () {
      try {
        const newBrewer = new Brewer()
        newBrewer.name = 'New Brewer'
        newBrewer.city().associate(barcelona)
        yield newBrewer.save()
        newBrewer.name = 'Almogàver'
        yield newBrewer.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('UniqueValueException')
      }
    })

    it('Update city to a valid instance should save', function* () {
      try {
        const lleida = new City()
        lleida.name = 'Lleida'
        lleida.country().associate(catalunya)
        yield lleida.save()
        const almogaver = yield Brewer.findBy('name', 'Almogàver')
        almogaver.city().associate(lleida)
        yield almogaver.save()
        almogaver.city_id.should.equal(lleida.id)
      } catch (ex) {
        should.not.exist(ex)
      }
    })
    it('Dissociate city should throw RequiredException', function* () {
      try {
        const almogaver = yield Brewer.findBy('name', 'Almogàver')
        almogaver.city().dissociate()
        yield almogaver.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('RequiredException')
      }
    })
    it('Update city to invalid instance should throw ModelRelationException', function* () {
      try {
        const unsavedCity = new City()
        unsavedCity.name = 'Unsaved'
        const almogaver = yield Brewer.findBy('name', 'Almogàver')
        almogaver.city().associate(unsavedCity)
        yield almogaver.save()
        true.should.equal(false)
      } catch (ex) {
        ex.name.should.equal('ModelRelationException')
      }
    })
  })

  describe('Delete brewer', function () {
    it('Brewer without associated beers should delete', function* () {
      try {
        const almogaver = yield Brewer.findBy('name', 'Almogàver')
        should.exist(almogaver)
        yield almogaver.delete()
      } catch (ex) {
        should.not.exist(ex)
      }
    })
    it('Brewer with associated beers should throw Error')
  })
})
