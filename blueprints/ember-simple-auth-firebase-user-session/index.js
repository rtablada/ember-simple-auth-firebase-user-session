var RSVP = require('rsvp');

module.exports = {
  description: 'Initializes ember-simple-auth-firebase-user-session',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return RSVP.all([
      this.addPackageToProject('ember-cli-simple-auth', '~0.8.0'),
      this.addPackageToProject('ember-cli-simple-auth-firebase', '~1.0.5'),
      this.addToConfig('simple-auth', '{ session: \'session:with-user\' }'),
    ]);
  }
};
