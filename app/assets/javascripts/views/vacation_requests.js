App.Views.VacationRequests = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_requests'],

  initialize: function(options) {
    this.options = options;
    this.data = {
      highestPrivilege: App.currentUserRoles.highestPrivilege()
    };

    this.listenToOnce(this.options.vacationRequests, 'sync',  this.render);
  },

  render: function() {
    this.$el.html(this.template(this.data));

    this.vacationRequestForm = new App.Views.VacationRequestForm({
      'holidays': this.options.holidays,
      'vacationRequests': this.options.vacationRequests,
      'availableVacations': this.options.availableVacations,
    }).render();

    this.vacationRequestsList = new App.Views.VacationRequestsList({
      'vacationRequests': this.options.vacationRequests,
      'availableVacations': this.options.availableVacations,
    }).render();

    return this;
  }
});
