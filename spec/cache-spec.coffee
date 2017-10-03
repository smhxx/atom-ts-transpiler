# coffeelint: disable=max_line_length
fs = require 'fs'
path = require 'path'
sinon = (require 'sinon').sandbox.create

cache = require '../dist/cache'

describe 'cache', ->

  beforeEach ->
    if (this.sinon == undefined)
      this.sinon = sinon()
    else
      this.sinon.restore()

  configBuffer = fs.readFileSync path.resolve 'spec/fixtures/tsconfig.json'
  configData = JSON.parse configBuffer.toString()
  moduleDir = path.resolve 'spec/fixtures/node_modules/typescript'
  moduleData = require moduleDir

  describe 'getCache()', ->

    it 'returns the resolved config and transpiler module for the given directory', ->
      entry = cache.getCache path.resolve 'spec/fixtures/index.js'
      should(entry).not.be.undefined()
      should(entry.config).not.be.undefined()
      should(entry.transpiler).not.be.undefined()
      entry.config.should.deepEqual configData
      entry.transpiler.should.equal moduleData

    it 'returns the previously cached information if it already exists for the directory', ->
      this.sinon.spy require
      this.sinon.spy JSON, 'parse'
      entry = cache.getCache path.resolve 'spec/fixtures/other.js'
      require.should.not.be.called()
      JSON.parse.should.not.be.called()
      should(entry).not.be.undefined()
      should(entry.config).not.be.undefined()
      should(entry.transpiler).not.be.undefined()
      entry.config.should.deepEqual configData
      entry.transpiler.should.equal moduleData
