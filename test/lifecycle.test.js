var _ = require('lodash')
require('dotenv').config()
process.env.MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/codeclouds_shankha_test"
process.env.NODE_ENV = "test"
const app = require('./../app');
const dataStore = require('./../src/core/dataStore');

// Before running any tests...
before(function (done) {

  // Increase the Mocha timeout so that it has enough time to lift, even if you have a bunch of assets.
  this.timeout(10000)


  app.set('port', 5000);

  app.listen(app.get('port'), (err) => done(err, app))
})

// After all tests have finished...
after(async () => {
  // Drop all collections
  const collections = await dataStore.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany()
  }

})
