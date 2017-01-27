'use strict'

const NE = use('node-exceptions')

class RequiredException extends NE.LogicalException {
    static failed(fields) {
        const instance = new this('Required value', 400)
        instance.fields = fields
        return instance
    }
}

module.exports = RequiredException