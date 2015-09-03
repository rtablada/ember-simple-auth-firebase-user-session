var EOL      = require('os').EOL;
var chalk    = require('chalk');
var fs       = require('fs-extra');
var RSVP     = require('rsvp');
var readFile = RSVP.denodeify(fs.readFile);

module.exports = {
  description: 'Initializes ember-simple-auth-firebase-user-session',

  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return RSVP.all([
      this.addPackageToProject('ember-cli-simple-auth', '~0.8.0'),
      this.addPackageToProject('ember-cli-simple-auth-firebase', '~1.0.5'),
      this.addToConfig('\'simple-auth\'', '{\n      session: \'session:with-user\'\n    }'),
    ]);
  },

  addToConfig: function (key, value) {
    var self = this;
    return this.fileContains('config/environment.js', key + ':').then(function (contains) {
      if (contains) { return true; }

      var options = { after: '    environment: environment,' + EOL };
      return self.insertIntoFile('config/environment.js', '    ' + key + ': ' + value + ',', options);
    });
  },

  fileContains: function (filePath, snippet) {
    return readFile(filePath).then(function (fileContents) {
      return fileContents.toString().indexOf(snippet) !== -1;
    });
  }
};
