const chai = use('chai')
const should = chai.should()
const request = use('supertest')
const co = use('co')
const Ioc = use('adonis-fold').Ioc
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/`
const apiUrl = `${baseUrl}api/v1/`
use('co-mocha')

describe('Country controller', function () {
    afterEach(function* () {
        yield use('Database').table('countries').delete()
    })

    it('should get a 200 when making a request to fetch countries', function* () {
        const response = yield request(apiUrl)
            .get('countries')
            .expect(200)
            .expect('Content-Type', /json/)
    })

    it('should return an empty array when there are no countries', function* () {
        const response = yield request(apiUrl)
            .get('countries')
            .expect(200)
            .expect('Content-Type', /json/)

        response.body.should.be.an.Array
        response.body.length.should.equal(0)
    })

    it('should return the countries when they exist', function* () {
        yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const response = yield request(apiUrl)
            .get('countries')
            .expect(200)
            .expect('Content-Type', /json/)

        response.body.should.be.an.Array
        response.body.length.should.equal(1)
        response.body[0].name.should.match(/Catalunya/)
    })

    it('should return a country by id', function* () {
        const catalunya = yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const response = yield request(apiUrl)
            .get(`countries/${catalunya.id}`)
            .expect(200)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
        response.body.name.should.match(/Catalunya/)
    })

    it('should return 404 for a non existing id', function* () {
        const response = yield request(apiUrl)
            .get('countries/0')
            .expect(404)

        response.body.should.be.Object
    })

    it('should return 201 for a new non existing country', function* () {
        const response = yield request(apiUrl)
            .post('countries')
            .send({
                name: 'Germany'
            })
            .expect(201)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
        response.body.name.should.be.a.string
    })

    it('should return 400 for a new country without name', function* () {
        const response = yield request(apiUrl)
            .post('countries')
            .send({
                name: ''
            })
            .expect(400)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
    })
    it('should return 409 for a new country with an existing name', function* () {
        const catalunya = yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const response = yield request(apiUrl)
            .post('countries')
            .send({
                name: 'Catalunya'
            })
            .expect(409)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
    })
    it('should return 404 when updating a non existing country id', function* () {
        const response = yield request(apiUrl)
            .put('countries/0')
            .send({
                name: 'Catalunya'
            })
            .expect(404)

        response.body.should.be.Object
    })
    it('should return 200 and update a changed country if the new name doesn\'t exist', function* () {
        const catalunya = yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const response = yield request(apiUrl)
            .put(`countries/${catalunya.id}`)
            .send({
                name: 'Germany'
            })
            .expect(200)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
    })

    it('should return 400 for an update to no name', function* () {
        const catalunya = yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const response = yield request(apiUrl)
            .put(`countries/${catalunya.id}`)
            .send({
                name: ''
            })
            .expect(400)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
    })

    it('should return 409 for an update to a previously existing name', function* () {
        const catalunya = yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const germany = yield use('App/Model/Country').create({
            name: 'Germany'
        })

        const response = yield request(apiUrl)
            .put(`countries/${catalunya.id}`)
            .send({
                name: 'Germany'
            })
            .expect(409)
            .expect('Content-Type', /json/)

        response.body.should.be.Object
    })

    it('should return 204 for a successful delete', function* () {
        const catalunya = yield use('App/Model/Country').create({
            name: 'Catalunya'
        })

        const response = yield request(apiUrl)
            .delete(`countries/${catalunya.id}`)
            .expect(204)

        response.body.should.be.empty
    })

    it('should return 404 for a deletion to a non existing id',function* () {
        const response = yield request(apiUrl)
            .delete('countries/0')
            .expect(404)

        response.body.should.be.Object
    })
})
