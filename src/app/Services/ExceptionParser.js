'use strict'

const ExceptionParser = exports = module.exports = {}

/**
 * handlers is the list of custom handlers to handle exceptions.
 * For example throw new ValidationException can be handled
 * using ValidationException function on the handlers
 * object.
 *
 * @type       {Object}
 */
const handlers = {
    RequiredException: function (error, request, response) {
        const message = error.fields || 'Bad request'
        const status = error.status || 400
        response.badRequest({ status, message })
    },
    UniqueValueException: function (error, request, response) {
        const message = error.fields || 'Conflict'
        const status = error.status || 409
        response.conflict({ status, message })
    },
    ModelNotFoundException: function (error, request, response) {
        const message = error.message || 'Not found'
        const status = 404
        response.notFound({ status, message })
    },
    default: function (error, request, response) {
        const message = error.message || 'Something went wrong'
        const status = error.status || 500
        response.status(status).send({ status, message })
    }
}

/**
 * send method is used to make the final user friendly error
 * and send it back to the user/browser.
 *
 * @param      {Object}  error     The error
 * @param      {Object}  request   The request
 * @param      {Object}  response  The response
 *
 * @public
 */
ExceptionParser.send = (error, request, response) => {
    const handler = handlers[error.name] || handlers.default
    handler(error, request, response)
}