'use strict'
const Antl = use('Antl')
const CityModel = use('App/Model/City')
const RequiredException = use('App/Exceptions/RequiredException')
const UniqueValueException = use('App/Exceptions/UniqueValueException')
const ValidationException = use('App/Exceptions/ValidationException')
const City = exports = module.exports = {}

const validateRequired = function validateRequired(instance) {
  const messages = []
  if (!instance.name) {
    messages.push(Antl.formatMessage('validation.required', {
      field: Antl.formatMessage('general.name')
    }))
  }
  if (!instance.country_id) {
    messages.push(Antl.formatMessage('validation.required', {
      field: Antl.formatMessage('general.country_id')
    }))
  }
  if (messages.length > 0) {
    throw RequiredException.failed(messages)
  }
  return true;
}

const validateUnique = function* validateUnique(instance) {
  const existing = yield CityModel.query().where(function () {
    this.where('name', instance.name)
    this.where('country_id', instance.country_id)
  })
  const messages = []
  if (existing.length > 0) {
    if (!instance.id || instance.id !== existing.id) {
      messages.push(Antl.formatMessage('validation.unique', {
        field: Antl.formatMessage('general.name')
      }))
    }
  }
  if (messages.length > 0) {
    throw UniqueValueException.failed(messages)
  }
}

City.validate = function* (next) {
  validateRequired(this)
  const unique = yield validateUnique(this)
  yield next
}

