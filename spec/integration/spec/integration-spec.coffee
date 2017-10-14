{ WorkspaceView } = require 'atom'

describe 'integration testing', ->
  it 'ensures that the test package can be activated without errors', ->
    jasmine.attachToDOM atom.views.getView atom.workspace
    waitsForPromise -> atom.packages.activatePackage 'test-package'
