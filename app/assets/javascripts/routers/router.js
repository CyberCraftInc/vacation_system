App.Router = Backbone.Router.extend({
  routes: {
    'dashboard':              'dashboard',
    'teams':                  'teams',
    'vacation_requests':      'vacation_requests',
    'holidays':               'holidays',
  },

  dashboard: function() {
    var holidays = new App.Collections.Holidays(),
        teams = new App.Collections.Teams(),
        approvalRequests = new App.Collections.ApprovalRequests(),
        availableVacations = new App.Collections.AvailableVacations(),
        personalVacationRequests = new App.Collections.PersonalVacationRequests();

    App.dashboard = new App.Views.Dashboard({
      'holidays': holidays,
      'teams': teams,
      'approvalRequests': approvalRequests,
      'availableVacations': availableVacations,
      'personalVacationRequests': personalVacationRequests
    });

    personalVacationRequests.fetch()
      .then(function() {
        return holidays.fetch();
      })
      .then(function() {
        return teams.fetch();
      })
      .then(function() {
        return availableVacations.fetch();
      })
      .then(function() {
        return approvalRequests.fetch();
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

    availableVacations.url = function () {
      var userID = App.currentUser.get('id').toString();
      return 'users/'+userID+'/available_vacations';
    };

    App.vacation_requests = new App.Views.VacationRequests({
      'holidays': holidays,
      'vacationRequests': vacationRequests,
      'availableVacations': availableVacations
    });

    availableVacations.fetch()
      .then(function() {
        holidays.fetch()
          .then(function() {
            vacationRequests.fetch();
          });
      });
  },

  holidays: function() {
    var collection = new App.Collections.Holidays();
    App.holidays = new App.Views.Holidays({'collection':collection});
    collection.fetch();
  }
});
