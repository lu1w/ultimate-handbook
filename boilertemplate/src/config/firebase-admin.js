const admin = require('firebase-admin');
const { firebaseAdmin: firebaseAdminConfig } = require('./config');

const serviceAccount = firebaseAdminConfig;

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = app.auth();

module.exports = { auth };
