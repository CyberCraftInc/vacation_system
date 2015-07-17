App.Collections.TeamVacations = Backbone.Collection.extend({
  initialize: function( options ) {
    this.url = function() {
      return '/team_vacations/' + options.team_id.toString();
    };
  }
});
