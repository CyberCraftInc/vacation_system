App.Models.Notification = Backbone.Model.extend({
  urlRoot: '/notifications',

  getTeamsInNotification: function(teams, notification_teams) {
    var result = [];
    var notificationID = this.get('id');

    notification_teams.each(function(model){
      if (model.attributes.notification_id == notificationID) {
        result.push(model.attributes.team_id);
      }
    });
    return result;
  }
});
