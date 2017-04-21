
const User = require('../../lib/models/user');
const assert = require('chai').assert;

describe('it creates a full user model', () => {
  it('should require the username field', done => {
    const user =  new User({
      password: 'test',
      roles: ['user'],
      communityId: '582a52f8eaee951a90b97839'
    });

    user.validate(err => {
      assert.isOk(err, 'username is required');
      done();
    });
  });

  it('should require the password field', done => {
    const user =  new User({
      username: 'test',
      roles: ['user'],
      communityId: '582a52f8eaee951a90b97839'
    });

    user.validate(err => {
      assert.isOk(err, 'password is required');
      done();
    });
  });

  it('should default the roles array to user', done => {
    const user =  new User({
      password: 'test',
      username: 'test user',
      communityId: '582a52f8eaee951a90b97839'
    });
    // be explicit
    assert.equal(user.roles.length, 1);
    assert.equal(user.roles[0], 'user');
    done();
  });
});
