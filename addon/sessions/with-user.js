import Ember from 'ember';
import Session from 'simple-auth/session';

var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

export default Session.extend({
  firebase: Ember.inject.service(),

  getCurrentUser: function() {
    var firebase = this.get('firebase');
    var authData = firebase.getAuth();

    if (authData) {
      var {provider, uid} = authData.auth;

      return new Ember.RSVP.Promise((resolve) => {
        this.get('dataStore').query('user', {orderBy: 'uid', equalTo: uid}).then((users) => {
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
    }
  },
  currentUser: function() {
    return ObjectPromiseProxy.create({
      promise: this.getCurrentUser()
    });
  }.property('content.secure.user')
});
