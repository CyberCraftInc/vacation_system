var app = app || {};

console.log('Inside model file');

app.Team = Backbone.Model.extend({
  defaults: {
    'name': '',
  },
});
