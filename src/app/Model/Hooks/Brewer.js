'use strict'

const Antl = use('Antl')
const BrewerModel = use('App/Model/Brewer')
const RequiredException = use('App/Exceptions/RequiredException')
const UniqueValueException = use('App/Exceptions/UniqueValueException')
const ValidationException = use('App/Exceptions/ValidationException')
const Brewer = exports = module.exports = {}

const validateRequired = function validateRequired(instance) {
  const messages = []
  if (!instance.name) {
    messages.push(Antl.formatMessage('validation.required', {
      field: Antl.formatMessage('general.name')
    }))
  }
  if (!instance.city_id) {
    messages.push(Antl.formatMessage('validation.required', {
      field: Antl.formatMessage('general.city_id')
    }))
  }
  if (messages.length > 0) {
    throw RequiredException.failed(messages)
  }
  return true;
}

const validateUnique = function* validateUnique(instance) {
  const existing = yield BrewerModel.findBy('name',instance.name)
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



Brewer.validate = function* (next) {
  validateRequired(this)
  const unique = yield validateUnique(this)
  yield next
}
