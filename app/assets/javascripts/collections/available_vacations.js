App.Collections.AvailableVacations = Backbone.Collection.extend({
  url: '/available_vacations',
  model: App.Models.AvailableVacation,
});
