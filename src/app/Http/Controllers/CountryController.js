'use strict'

const Country = use('App/Model/Country')
const Database = use('Database')
const Validator = use('Validator')
const Antl = use('Antl')

class CountryController {

  * index(request, response) {
    const countries = yield Country.all()
    response.ok(countries);
  }

  * create(request, response) {
    //
  }

  * store(request, response) {
    const postData = request.post()
    const newCountry = yield Country.create(postData)
    response.created(newCountry)
  }

  * show(request, response) {
    response.ok(yield Country.findOrFail(request.param('id')))
  }

  * edit(request, response) {
    //
  }

  * update(request, response) {
    const postData = request.post()
    const country = yield Country.findOrFail(request.param('id'))
    country.name = postData.name
    yield country.save()
    response.ok(country)
  }

  * destroy(request, response) {
    const country = yield Country.findOrFail(request.param('id'))
    yield country.delete()
    response.noContent()
  }

}

module.exports = CountryController
