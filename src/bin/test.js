'use strict'

/*
|--------------------------------------------------------------------------
| Test runner
|--------------------------------------------------------------------------
*/

const path = require('path')
const globby = require('globby')
const bootstrap = require('./bootstrap')
const yargs = require('yargs').argv
process.env.ENV_PATH = '.env.test'

const testFiles = {
  functional: 'test/functional/*.js',
  unit: 'test/unit/*.js',
  integration: 'test/integration/*.js'
}

function getTestGlobs(filters) {
  if (!filters.length) {
    return Object.keys(testFiles).map((pattern) => testFiles[pattern])
  }
  return filters.map((key) => testFiles[key])
}

function runTests(mocha, fireServer, Server) {
  if (fireServer) {
    Server.listen(process.env.HOST, process.env.PORT)
  }
  if (!yargs.reporter) {
    mocha.reporter(require('./reporter'))
  } else {
    mocha.reporter(yargs.reporter)
  }

  mocha.run(function (failures) {
    use('Database').close()
    if (fireServer) {
      Server.getInstance().close()
    }
    process.on('exit', function () {
      process.exit(failures)
    })
  })
}

let fireServer = true
const filters = yargs.filter ? yargs.filter.split(',') : []
if (filters.length && filters.indexOf('functional') <= -1) {
  fireServer = false
}

const basePath = path.resolve(__dirname, '../')
bootstrap(function (Server) {
  const patterns = getTestGlobs(filters)
  globby(patterns, { cwd: basePath })
    .then((files) => {
      require('./setup')(files, runTests, fireServer, Server)
    })
    .catch(console.error)
})
