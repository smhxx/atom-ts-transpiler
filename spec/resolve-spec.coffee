# coffeelint: disable=max_line_length
fs = require 'fs'
path = require 'path'

resolve = require '../dist/resolve'

describe 'resolve', ->

  inputFile1 = path.resolve 'spec/fixtures/index.ts'
  inputFile2 = path.resolve 'spec/fixtures/some/deep/directory/structure/index.ts'

  describe 'resolveConfig()', ->

    configBuffer = fs.readFileSync path.resolve 'spec/fixtures/tsconfig.json'
    configData = JSON.parse configBuffer.toString()

    it 'returns the contents of the project\'s tsconfig file', ->
      resolved = resolve.resolveConfig inputFile1
      should(resolved).not.be.undefined()
      resolved.should.deepEqual configData

    it 'traverses the directory structure to search in parent directories', ->
      resolved = resolve.resolveConfig inputFile2
      should(resolved).not.be.undefined()
      resolved.should.deepEqual configData

  describe 'resolveTranspiler()', ->

    moduleDir = path.resolve 'spec/fixtures/node_modules/typescript'
    moduleData = require moduleDir

    it 'returns the project\'s local TypeScript transpiler module', ->
      resolved = resolve.resolveTranspiler inputFile1
      should(resolved).not.be.undefined()
      resolved.should.equal moduleData

    it 'traverses the directory structure to search in parent directories', ->
      resolved = resolve.resolveTranspiler inputFile2
      should(resolved).not.be.undefined()
      resolved.should.equal moduleData
