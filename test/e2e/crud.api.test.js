
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const app = require('../../lib/app');

const request = chai.request(app);

const user = {username: 'user', password:'password'};
const experience = {name:'restaurant', time: '12:00', howFast: 3, calledAhead: false, cost: 2, worthIt: 3, advice:'good food'};
const editExp = {name:'restaurant', time: '12:00', howFast: 3, calledAhead: true, cost: 2, worthIt: 3, advice:'try the fries!'};
const favUser = {username:'favUser', password:'password'};

describe('testing user endpoints', () => {

  before(done => {
    request
      .post('/lunch/auth/signup')
      .send(favUser)
      .then(res => {
        favUser.token = res.body.token;
        done();
      })
      .catch(done);
  });

  it('should create a new user', done => {
    request
      .post('/lunch/auth/signup')
      .send(user)
      .then(res => {
        user.token = res.body.token;
        assert.isOk(res.body.token);
        done();
      })
      .catch(done);
  });


  it('should add a user as a favorite', done => {
    request
      .put('/lunch/users/favorite')
      .set({'authorization': user.token})
      .send(favUser)
      .then(res => {
        assert.isOk(res.body.favoriteUsers.length > 0);
        user.favoriteUsers = res.body.favoriteUsers;
        done();
      })
      .catch(done);
  });

  it('should dispaly favorite users', done => {
    request
      .get('/lunch/users/favorite')
      .set({'authorization': user.token})
      .then(res => {
        assert.isArray(res.body);
        assert.deepEqual(res.body[0], {username: 'favUser'});
        done();
      })
      .catch(done);
  });

});

describe('testing community endpoints', () => {
  it('should create a new community', done => {
    request
      .post('/lunch/community/create')
      .set('authorization', user.token)
      .send({name: 'codefellows'})
      .then(res => {
        user.communityId = res.body.communityId;
        assert.isOk(res.body.communityId);
        done();
      })
      .catch(done);
  });
  it('shouldn\'t let you create a community that already exists', done => {
    request
      .post('/lunch/community/create')
      .set('authorization', user.token)
      .send({name: 'codefellows'})
      .then(() => done('Response should not be 200'))
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, 'Community codefellows already exists!');
        done();
      });
  });

  it('shouldn\'t let you join a community that doesn\'t exist', done => {
    request
      .post('/lunch/community/join')
      .set('authorization', user.token)
      .send({name: 'no-fellows'})
      .then(() => done('Response should not be 200'))
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, 'Community no-fellows does not yet exist!');
        done();
      });
  });
});

describe('testing experience endpoints', () => {
  it('should create a new experience', done => {
    request
      .post('/lunch/experiences')
      .set('authorization', user.token)
      .send(experience)
      .then(res => {
        experience._id = res.body._id;
        experience.__v = res.body.__v;
        experience.communityId = res.body.communityId;
        experience.userId = res.body.userId;
        assert.deepEqual(res.body, experience);
        done();
      })
      .catch(done);
  });

  it('should show community experiences', done => {
    request
      .get('/lunch/community/' + user.communityId)
      .set('authorization', user.token)
      .then(res => {
        assert.isArray(res.body);
        assert.isOk(res.body);
        done();
      })
      .catch(done);
  });
  
  it('should get selected user\'s experiences', done => {
    request
      .get('/lunch/experiences/' + user.username)
      .set('authorization', user.token)
      .then(res => {
        experience.postedOn = res.body[0].postedOn;
        experience.userId = res.body[0].userId;
        assert.deepEqual(res.body, [experience]);
        done();
      })
      .catch(done);
  });
  
  it('should update an existing experience', done => {
    request
      .put(`/lunch/experiences/${experience._id}`)
      .set('authorization', user.token)
      .send(editExp)
      .then(res => {
        editExp._id = res.body._id;
        editExp.__v = res.body.__v;
        editExp.communityId = res.body.communityId;
        editExp.userId = res.body.userId;
        assert.deepEqual(res.body, editExp);
        done();
      })
      .catch(done);
  });

  it('should aggregate experiences by vendor', done => {
    request
      .get('/lunch/vendors')
      .set('authorization', user.token)
      .then(res => {
        assert.deepEqual(res.body[0][0], { _id: 'restaurant', howFast: 3, cost: 2, worthIt: 3 });
        done();
      })
      .catch(done);
  });

  it('should filter by order ahead', done => {
    request
      .get('/lunch/community/advance')
      .set('authorization', user.token)
      .then(res => {
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].name, 'restaurant');
        done();
      })
      .catch(done);
  });

});