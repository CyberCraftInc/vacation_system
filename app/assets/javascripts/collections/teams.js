var app = app || {};

var TeamList = Backbone.Collection.extend({
  url: '/teams',
  model: app.Team,

});

app.Teams = new TeamList();
