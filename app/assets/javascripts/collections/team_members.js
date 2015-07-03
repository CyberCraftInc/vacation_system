App.Collections.TeamMembers = Backbone.Collection.extend({
  initialize: function( teamID ) {
    this.url = function() {
      return '/team_members/' + teamID;
    };
  }
});
