App.Models.VacationRequest = Backbone.Model.extend({
  urlRoot: 'vacation_requests',
  defaults: {
    'kind':     '',
    'duration': 1,
  },
});
