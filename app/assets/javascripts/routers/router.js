App.Router = Backbone.Router.extend({
  routes: {
    'dashboard':              'dashboard',
    'teams':                  'teams',
    'vacation_requests':      'vacation_requests',
    'vacation_request/:id':   'vacation_request_details',
    'holidays':               'holidays',
  },

  dashboard: function() {
    var holidays = new App.Collections.Holidays();
    $('.content').html("Dashboard =)");

    holidays.fetch().then(function() {
      App.dashboard = new App.Views.Dashboard({
        'holidays': holidays
      });
    });
  },

  teams: function() {
    $('.content').html("You should see the list for Teams...");
    var collection = new App.Collections.Teams();
    App.teams = new App.Views.Teams({'collection':collection});
    collection.fetch();
  },

  vacation_requests: function() {
    var holidays = new App.Collections.Holidays(),
        vacationRequests = new App.Collections.VacationRequests(),
        availableVacations = new App.Collections.AvailableVacations();

    App.vacation_requests = new App.Views.VacationRequests({
      'holidays': holidays,
      'vacationRequests': vacationRequests,
      'availableVacations': availableVacations
    });

    availableVacations.fetch()
      .then(function() {
        holidays.fetch();
      })
      .then(function() {
        vacationRequests.fetch();
      });
  },

  vacation_request_details: function( id ) {
    $('.content').html("You should see the <strong>Vacation Request Details</strong>...");
    App.vacation_request_details = new App.Views.VacationRequestDetails({modelID:id});
  },

  holidays: function() {
    $('.container section').html("Holidays must be here...");
    var collection = new App.Collections.Holidays();
    App.holidays = new App.Views.Holidays({'collection':collection});
    collection.fetch();
  }
});
