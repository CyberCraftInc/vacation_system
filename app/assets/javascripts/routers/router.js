App.Router = Backbone.Router.extend({
  routes: {
    'dashboard':          'dashboard',
    'teams':              'teams',
    'vacation_requests':  'vacation_requests',
    'holidays':           'holidays',
    'users':              'users',
  },

  dashboard: function() {
    var approvalRequests = new App.Collections.ApprovalRequests(),
        availableVacations = new App.Collections.AvailableVacations(),
        holidays = new App.Collections.Holidays(),
        personalVacationRequests = new App.Collections.PersonalVacationRequests(),
        teams = new App.Collections.Teams();

    App.dashboard = new App.Views.Dashboard({
      'approvalRequests': approvalRequests,
      'availableVacations': availableVacations,
      'holidays': holidays,
      'personalVacationRequests': personalVacationRequests,
      'teams': teams,
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
      })
      .then(function() {
        App.dashboard.render();
      });
  },

  teams: function() {
    var roles = new App.Collections.Roles(),
        teams = new App.Collections.Teams(),
        users = new App.Collections.Users();

    App.teams = new App.Views.Teams({
      'roles':roles,
      'teams':teams,
      'users':users
    });

    roles.fetch()
      .then(function() {
        return teams.fetch();
      })
      .then(function() {
        return users.fetch();
      });
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
  },

  users: function() {
    var users = new App.Collections.Users();

    App.users = new App.Views.Users({
      'users': users
    });

    users.fetch()
      .then(function() {
          App.users.render();
      });
  }
});
