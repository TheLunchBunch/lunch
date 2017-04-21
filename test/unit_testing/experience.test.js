
const Experience = require('../../lib/models/experience');
const assert = require('chai').assert;

describe('Creates full Model for experiences', () => {
  it('should require name field', done => {
    const experience = new Experience({
      time: new Date(),
      calledAhead: true,
      howfast: 2
    });

    experience.validate(err => {
      assert.isOk(err, 'name is required');
      done();
    });
  });

  it('should require howfast field', done => {
    const experience = new Experience({
      name: 'test user',
      time: new Date(),
      calledAhead: true
    });

    experience.validate(err => {
      assert.isOk(err, 'howfast is required');
      done();
    });
  });

  it('should require calledAhead field', done => {
    const experience = new Experience({
      name: 'test user',
      time: new Date(),
      howfast: 2
    });

    experience.validate(err => {
      assert.isOk(err, 'calledAhead is required');
      done();
    });
  });
});