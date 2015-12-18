App.Models.User = Backbone.Model.extend({
  defaults: {
    'first_name':'',
    'last_name':'',
    'email':'',
    'position':'',
    'username':'',
    'birth_date':'',
    'employment_date':''
  },

  composeFullName: function() {
    var result = '',
        value = this.get('first_name');

    if (_.isString(value)) {
      result = value.trim();
    }

    value = this.get('last_name');
    if (_.isString(value)) {
      result = result.concat(' ' + value.trim());
    }

    return result;
  },

  // Get roles for the user in the provided team.
  // The following input data are expected:
  //  - ID of team, integer
  //  - App.Collections.Roles instance
  // Returns array of App.Models.Role.
  getRolesInTeam: function(teamID, roles) {
    var result = [];

    result = roles.filter(function(role) {
      var isRoleOwner = (role.get('user_id') === this.get('id')),
          isAssignedToTeam = (teamID === role.get('team_id'));

      return (isRoleOwner && isAssignedToTeam);
    }, this);

    return result;
  }

  // TODO: add validation
  // validation: {
  //   description: {
  //     required: true,
  //     rangeLength: [5, 25]
  //   },
  //   duration: {
  //     required: true,
  //     range: [1, 5]
  //   },
  //   start: {
  //     required: true,
  //     length: 10
  //   },
  // }
});
