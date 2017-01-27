'use strict'

const NE = use('node-exceptions')

class UniqueValueException extends NE.LogicalException {
    static failed(fields) {
        const instance = new this('Conflict', 409)
        instance.fields = fields
        return instance
    }
}

module.exports = UniqueValueException