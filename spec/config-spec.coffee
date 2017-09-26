fs = require 'fs'
path = require 'path'
should = require 'should'
sinon = require 'sinon'
require 'should-sinon'
require 'mocha-sinon'

config = require '../lib/config'

describe 'lib/config', ->

  expected = JSON.parse fs.readFileSync 'spec/fixtures/tsconfig.json'

  describe '.get()', ->

    it 'returns the absolute path to tsconfig.json', ->
      actual = config.get path.resolve 'spec/fixtures/index.ts'
      actual.should.deepEqual expected

    it 'traverses the directory tree to find the closest ancestor tsconfig file', ->
      actual = config.get path.resolve 'spec/fixtures/some/deep/directory/structure/index.ts'
      actual.should.deepEqual expected

    it 'caches config settings per-directory to avoid duplicate calls to readFileSync()', ->
      config.get path.resolve 'spec/fixtures/index.ts'
      sinon.spy fs, 'readFileSync'
      config.get path.resolve 'spec/fixtures/other.ts'
      fs.readFileSync.should.not.be.called()
