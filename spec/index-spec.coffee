path = require 'path'
should = require 'should'
sinon = require 'sinon'
require 'should-sinon'
require 'mocha-sinon'

transpiler = require '../lib/index'

it 'does not load the transpiler until needed', ->
  typescript = require.cache[require.resolve 'typescript']
  should(typescript).be.undefined()

describe 'atom-ts-transpiler', ->

  describe '.getConfigCache()', ->

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

    it 'writes any encountered errors to console.error() and does not return any code', ->
      sinon.stub console, 'error'
      ret = transpiler.transpile '', (path.resolve 'spec/fixtures/not-a-real-file.ts')
      console.error.should.be.calledOnce()
      ret.should.be.an.Object()
      should(ret.code).be.undefined()

    it 'uses the compiler options specified in tsconfig.json', ->
      { code } = transpiler.transpile '', (path.resolve 'spec/fixtures/index.ts')
      code.should.not.match /\/\/ This is a comment/

    it 'overrides the tsconfig options with any specified in the package.json', ->
      { code } = transpiler.transpile '', (path.resolve 'spec/fixtures/index.ts'), { removeComments: false }
      code.should.match /\/\/ This is a comment/
