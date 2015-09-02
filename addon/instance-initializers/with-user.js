export default function(instance) {
  var store = instance.container.lookup('service:store');
  var session = instance.container.lookup('session:with-user');

  session.dataStore = store;
}
