// Support for triggering `before` and `after` events inside BB's `route` method.
// http://stackoverflow.com/questions/7394695/backbone-js-call-method-before-after-a-route-is-fired

App.Router = Backbone.Router.extend({
  routes: {
    'dashboard':              'dashboard',
    'teams':                  'teams',
    'new_vacation_request':   'new_vacation_request',
    'vacation_requests_list': 'vacation_requests_list',
    'vacation_request/:id':   'vacation_request_details',
    'calendar':               'calendar',
  },

  dashboard: function() {
    $('.content').html("Dashboard =)");
    App.dashboard = new App.Views.Dashboard();
  },

  teams: function() {
    $('.content').html("You should see the list for Teams... that's all I can tell you, dude O_O");
    var collection = new App.Collections.Teams();
    App.teams = new App.Views.Teams({'collection':collection});
    collection.fetch();
  },

  new_vacation_request: function() {
    $('.content').html("You should see the <strong>Request</strong> form... that's all I can tell you, dude O_O");
    App.new_vacation_request = new App.Views.VacationRequestForm();
  },

  vacation_requests_list: function() {
    $('.content').html("You should see the <strong>List of Requests</strong>... that's all I can tell you, dude O_O");
    App.vacation_requests = new App.Views.VacationRequestsList();
  },

  vacation_request_details: function( id ) {
    $('.content').html("You should see the <strong>Vacation Request Details</strong>... that's all I can tell you, dude O_O");
    App.vacation_request_details = new App.Views.VacationRequestDetails({modelID:id});
  },

  calendar: function() {
    $('.content').html("Just a stub for the future Calendar...");
  }
});
