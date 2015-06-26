// Support for triggering `before` and `after` events inside BB's `route` method.
// http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired

App.Router = Backbone.Router.extend({
  routes: {
    'dashboard':          'dashboard',
    'teams':              'teams',
    'vacation_requests':  'vacation_requests',
    'calendar':           'calendar',
  },

  dashboard: function() {
    $('.content').html("Dashboard =)");
  },

  teams: function() {
    $('.content').html("You should see the list for Teams... that's all I can tell you, dude O_O");
    App.teams = new App.Views.Teams();
  },

  calendar: function() {
    $('.content').html("Just a stub for the future Calendar...");
  },

  vacation_requests: function() {
    $('.content').html("You should see the <strong>Request</strong> form... that's all I can tell you, dude O_O");
    App.vacation_requests = new App.Views.VacationRequest();
  }
});
