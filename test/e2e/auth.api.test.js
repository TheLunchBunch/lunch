

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const app = require('../../lib/app');

const request = chai.request(app);

describe('not authorized', () => {

  it('Rejects request if no token', done => {
    request
      .post('/lunch/community/create')
      .then(res => done('Response should not be 200.')) //eslint-disable-line
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, 'Unauthorized, no token provided');
        done();
      });
  });

  it('Rejects bad tokens', done => {
    request
      .post('/lunch/community/create')
      .set('authorization', 'badtoken')
      .send({name: 'mocha community test'})
      .then(res => done('Response should not be 200.')) //eslint-disable-line
      .catch(res => {
        assert.equal(res.status, 403);
        assert.equal(res.response.body.error, 'Unauthorized, bad token');
        done();
      });
  });

});

describe('user signup/signin', () => {

  function badRequest(url, send, error, done) {
    request
      .post(url)
      .send(send)
      .then(res => done('status should not be 200')) //eslint-disable-line
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, error);
        done();
      })
      .catch(done);
  }

  it('requires username for signup', done => {
    badRequest('/lunch/auth/signup', { password: 'hunter2' }, 'username and password required', done);
  });

  it('requires password for signup', done => {
    badRequest('/lunch/auth/signup', { username: 'testUsername' }, 'username and password required', done);
  });

});