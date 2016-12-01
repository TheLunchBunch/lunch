
const Community = require('../../lib/models/community');
const assert = require('chai').assert;

describe('creates the full community model', () => {
  it('should require name field', done => {
    const comm = new Community ({
      location: '920 sw 3rd'
    });

    comm.validate(err => {
      assert.isOk(err, 'name field is required');
      done();
    });
  });

  // it('should require location field', done => {
  //   const comm = new Community ({
  //     name: 'chipotle'
  //   });

  //   comm.validate(err => {
  //     assert.isOk(err, 'name field is required');
  //     done();
  //   });
  // });
});