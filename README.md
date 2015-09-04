# Ember-simple-auth-firebase-user-session

This Ember addon is an opinionated session storage for using Firebase with Ember Simple Auth.

## Installation

* For ember projects run `ember install ember-simple-auth-firebase-user-session`

The associated generator with this package will add `session: 'session:with-user'` to your `simple-auth` config.
If you already have any `simple-auth` configuration in your `config/environment.js` file, you will need to manually add this setting.

## Use

This is a very opinionated Session Store.
It uses Ember Data to look up a `user` model and looks up by a `uid` property.

At a minimum, your User model will need to look like: 

```js
import DS from 'ember-data';

export default DS.Model.extend({
  uid: DS.attr('string'),
});

```

The user model can optionally include the following other attributes which could be included with your model:

* `provider` - Provider used to login (`password`, `facebook`, `twitter`, etc.)
* `email` - Email associated with the logged in user (populated when possible by password provider)
* `profileImageURL` - Profile image via Gravatar associated with the logged in user (populated when possible by password provider)

## `session.currentUser`

Since Ember Simple Auth injects the selected session into your controllers and routes, you can get the logged in user model by accessing `session.currentUser`.
This is using an Ember Proxy Object with a Promise to resolve the user for use in templates.
However, if you want the current user for things like updating profile information or associating records, please use the `session.getCurrentUser` function.

## `session.getCurrentUser`

This function returns a promise to look up the current user by their `uid` property and will create and save a new user for the current session if none exists.
To look up the current user as a model for use in routes:

```
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('session').getCurrentUser();
  }
});
```

Using the currentUser for things like associating related records or updating profile information is a bit different:

```
import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    updateProfile(name) {
      this.get('session').getCurrentUser().then((user) => {
        user.set('name', name);

        user.save();
      });
    }
});
```
