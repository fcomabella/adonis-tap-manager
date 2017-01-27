'use strict'

const Antl = use('Antl')
const CountryModel = use('App/Model/Country')
const RequiredException = use('App/Exceptions/RequiredException')
const UniqueValueException = use('App/Exceptions/UniqueValueException')
const Country = exports = module.exports = {}

const validateRequired = function validateRequired(instance) {
  const messages = []
  if (!instance.name) {
    messages.push(Antl.formatMessage('validation.required', {
      field: Antl.formatMessage('general.name')
    }))
  }
  if (messages.length > 0) {
    throw RequiredException.failed(messages)
  }
  return
}

const validateUnique = function* (instance) {
  const existing = yield CountryModel.findBy('name', instance.name)
  const messages = []
  if (existing) {
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

Country.validate = function* validate(next) {
  validateRequired(this)
  const unique = yield validateUnique(this)
  yield next
}