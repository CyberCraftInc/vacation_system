App.Models.NotificationTeam = Backbone.Model.extend({
  urlRoot: '/notification_teams',

  defaults: {
    'notification_id':'',
    'team_id':''
  }
});
