import Ember from 'ember';
import Session from 'simple-auth/session';

export default Session.extend({
  firebase: Ember.inject.service(),

  currentUser: null,
  currentPromise: null,

  getCurrentUser: function() {
    if (this.get('currentUser')) {
      return Ember.RSVP.resolve(this.get('currentUser'));
    }

    if (this.get('currentPromise')) {
      return this.get('currentPromise');
    }

    var firebase = this.get('firebase');
    var authData = firebase.getAuth();

    if (authData) {
      var {provider, uid} = authData.auth;

      var promise = new Ember.RSVP.Promise((resolve) => {
        this.get('dataStore').query('user', {orderBy: 'uid', equalTo: uid}).then((users) => {
          this.set('currentPromise', null);
          var user = users.get('firstObject');

          if (user) {
            return resolve(user);
          } else {
            user = this.get('dataStore').createRecord('user', {uid, provider});

            user.save().then(() => {
              resolve(user);
            });
          }
        });
      });

      this.set('currentPromise', promise);
      return promise;
    }

    return Ember.RSVP.reject();
  },

  setCurrentUser: Ember.on('sessionAuthenticationSucceeded', function() {
    if (this.get('isAuthenticated')) {
      this.getCurrentUser().then((user) => {
        this.set('currentUser', user);
      });
    }
  }),
});
