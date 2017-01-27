'use strict'

const NumericValidations = exports = module.exports = {}

NumericValidations.validatePositiveInteger = function (value) {
  return /^(?:0|[^0\-]\d|\d+)$/g.test(value.toString())
}

NumericValidations.validateInteger = function (value) {
  return /^-(?:[^0]\d*)$/.test(value.toString())
}
