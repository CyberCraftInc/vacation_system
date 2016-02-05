App.Views.VacationRequests = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_requests'],

  initialize: function(options) {
    this.options = options;
    this.exportData = {
      highestPrivilege: App.currentUserRoles.highestPrivilege()
    };
  },

  render: function() {
    this.$el.html(this.template(this.exportData));

    this.vacationRequestForm = new App.Views.VacationRequestForm({
      'availableVacations': this.options.availableVacations,
      'holidays': this.options.holidays,
      'vacationRequests': this.options.vacationRequests,
    }).render();

    this.vacationRequestsList = new App.Views.VacationRequestsList({
      'availableVacations': this.options.availableVacations,
      'holidays': this.options.holidays,
      'teamMates': this.options.teamMates,
      'vacationApprovals': this.options.vacationApprovals,
      'vacationRequests': this.options.vacationRequests,
    }).render();

    return this;
  },

  showError: function(message) {
    this.$el.html(JST['templates/alerts/error']({'message':message}));
  }
});
