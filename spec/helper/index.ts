import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

declare global {
  type Mock = sinon.SinonMock;
  type Spy = sinon.SinonSpy;
  type Stub = sinon.SinonStub;
  let assert: Chai.AssertStatic;
  let expect: Chai.ExpectStatic;
  let mock: sinon.SinonMockStatic;
  let spy: sinon.SinonSpyStatic;
  let stub: sinon.SinonStubStatic;
}

chai.use(chaiAsPromised);
chai.use(sinonChai);

assert = chai.assert;
expect = chai.expect;
mock = sinon.mock;
spy = sinon.spy;
stub = sinon.stub;
