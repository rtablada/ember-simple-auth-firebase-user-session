import Ember from 'ember';
import Session from 'simple-auth/session';

var ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

export default Session.extend({
  currentUser: function() {
    var uid = this.get('content.secure.auth.uid');

    return ObjectPromiseProxy.create({
      promise: new Ember.RSVP.Promise((resolve) => {
        this.get('dataStore').query('user', {orderBy: 'uid', equalTo: uid}).then((users) => {
          resolve(users.get('firstObject'));
        });
      })
    });
  }.property('content.secure.user')
});
