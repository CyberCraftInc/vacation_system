App.Router = Backbone.Router.extend({
  routes: {
    'dashboard':              'dashboard',
    'teams':                  'teams',
    'vacation_requests':      'vacation_requests',
    'vacation_request/:id':   'vacation_request_details',
    'holidays':               'holidays',
  },

  dashboard: function() {
    var holidays = new App.Collections.Holidays(),
        teams = new App.Collections.Teams();

    App.dashboard = new App.Views.Dashboard({
      'holidays': holidays,
      'teams': teams
    });

    holidays.fetch()
      .then(function() {
        teams.fetch();
      });
  },

  teams: function() {
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
    App.vacation_request_details = new App.Views.VacationRequestDetails({modelID:id});
  },

  holidays: function() {
    var collection = new App.Collections.Holidays();
    App.holidays = new App.Views.Holidays({'collection':collection});
    collection.fetch();
  }
});
