

const express = require('express');
const app = express();
const path = require('path');
const auth = require('./routes/auth');
const pubDir = path.join(__dirname, '../public');
const ensureAuth = require('./auth/ensure-auth')();
// const ensureRole = require('/auth/ensure-role');
const errorHandler = require('./error-handler');
const communities = require('./routes/communities');
const users = require('./routes/users');
const experiences = require('./routes/experiences');
const vendors = require('./routes/vendors');

app.use('/lunch/auth', auth);
app.use('/lunch/community', ensureAuth, communities);
app.use('/lunch/experiences', ensureAuth, experiences);
app.use('/lunch/users', ensureAuth, users);
app.use('/lunch/vendors', ensureAuth, vendors);
app.use('/', express.static(pubDir));
app.use(errorHandler);

module.exports = app;
