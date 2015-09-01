App.Collections.CurrentUserRoles = Backbone.Collection.extend({
  roleFromTeamID: function(teamID) {
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
  },

  highestPrivilege: function() {
    var result = 'guest';
    result = this.max(function(model) {
      return this.getRoleAsNumber(model.get('role'));
    }, this).get('role');

    return result;
  },

  getRoleAsNumber: function(role) {
    var number = 0;

    switch (role) {
      case 'member':
        number = 1;
        break;
      case 'manager':
        number = 2;
        break;
      default:
        number = 0;
    }

    return number;
  }
});
