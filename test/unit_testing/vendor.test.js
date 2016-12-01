

const Vendor = require('../../lib/models/vendor');
const assert = require('chai').assert;

describe('Creates full Model for vendors', () => {
  it('should require name field', done => {
    const vendor = new Vendor({
      // name: 'Mod Pizza',
      Address: 'SW 2nd and Yamhill'
    });

    vendor.validate(err => {
      assert.isOk(err, 'name is required');
      done();
    });

  });  
  
});