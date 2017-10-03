# coffeelint: disable=max_line_length
fs = require 'fs'
path = require 'path'
sinon = (require 'sinon').sandbox.create

transpiler = require '../dist/index'
mock = require './fixtures/node_modules/typescript/mock'

it 'does not load the transpiler until needed', ->
  modulePath = path.resolve 'spec/fixtures/node_modules/typescript'
  typescript = require.cache[modulePath]
  should(typescript).be.undefined()

describe 'atom-ts-transpiler', ->

  beforeEach ->
    if (this.sinon == undefined)
      this.sinon = sinon()
    else
      this.sinon.restore()

  describe '.getCacheKeyData()', ->

    pkg = { path: path.resolve 'spec/fixtures' }
    opts = { cacheKeyFiles: [
      'index.ts',
      'some/deep/directory/structure/index.ts'
    ]}

    it 'returns empty string if no cacheKeyFiles are specified', ->
      data = transpiler.getCacheKeyData '', '', {}, pkg
      data.should.equal ''

    it 'returns the concatenated contents of the listed cacheKeyFiles', ->
      data = transpiler.getCacheKeyData '', '', opts, pkg
      data.should.match /\/\/ This is a comment\nconst foo: number = 14;\nexport default foo;/
      data.should.match /\/\/ This is a comment\nconst bar: number = 12;\nexport default bar;/

  describe '.transpile()', ->

    it 'calls the appropriate transpiler with the contents of the source file', ->
      filePath = path.resolve 'spec/fixtures/index.ts'
      expected = (fs.readFileSync filePath).toString()
      this.sinon.spy mock, 'transpileModule'
      transpiler.transpile '', filePath
      mock.transpileModule.should.be.calledOnce()
      actual = mock.transpileModule.getCall(0).args[0]
      should(actual).not.be.undefined()
      actual.should.equal expected

    it 'writes any encountered errors to console.error() and does not return any code', ->
      this.sinon.stub console, 'error'
      ret = transpiler.transpile '', (path.resolve 'spec/fixtures/not-a-real-file.ts')
      console.error.should.be.calledOnce()
      ret.should.be.an.Object()
      should(ret.code).be.undefined()

    it 'uses the compiler options specified in tsconfig.json', ->
      this.sinon.spy mock, 'transpileModule'
      transpiler.transpile '', (path.resolve 'spec/fixtures/index.ts')
      mock.transpileModule.should.be.calledOnce()
      options = mock.transpileModule.getCall(0).args[1].compilerOptions
      should(options.removeComments).equal true

    it 'overrides the tsconfig options with any specified in the package.json', ->
      this.sinon.spy mock, 'transpileModule'
      transpiler.transpile '', (path.resolve 'spec/fixtures/index.ts'), { removeComments: false }
      options = mock.transpileModule.getCall(0).args[1].compilerOptions
      should(options.removeComments).equal false
