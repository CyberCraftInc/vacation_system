App.Models.Team = Backbone.Model.extend({
  defaults: {
    'name': '',
  },

  validation: {
    name: {
      required: true,
      rangeLength: [5, 35]
    },
  }
});
