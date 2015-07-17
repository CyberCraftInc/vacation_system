App.Collections.CurrentUserRoles = Backbone.Collection.extend({
  url: 'users',

  roleFromTeamID: function( teamID ) {
    var result = null;

      result = this.find(function(model) {
      return teamID == model.attributes.team_id;
    });
    return result.attributes.role;
  },

  teams: function() {
    var result = [];
    this.each(function(model) {
      result.push(model.attributes.team_id);
    });

    return result;
  }
});
