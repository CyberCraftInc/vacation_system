// Support for triggering `before` and `after` events inside BB's `route` method.
// http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired

App.Router = Backbone.Router.extend({
  routes: {
    'dashboard': 'dashboard',
    'teams':     'teams',
    'calendar':  'calendar',
  },

  dashboard: function() {
    console.log('Dashboard');
    $('.content').html("Dashboard =)");
  },

  teams: function() {
    console.log('Teams');
    $('.content').html("You should see the list for Teams... that's all I can tell you, dude O_O");
    App.teams = new App.Views.Teams();
  },

  calendar: function() {
    console.log('Calendar');
    $('.content').html("Just a stub for the future Calendar...");
  },

  // default: function() {
  //   console.log('O_O');
  // },
});
