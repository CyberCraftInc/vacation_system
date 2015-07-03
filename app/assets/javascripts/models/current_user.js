App.Models.CurrentUser = Backbone.Model.extend({
  urlRoot: 'users',
  parse: function( data ) {
    var result = {};
    result = App.Helpers.extractObject(data,'current_user');
    // We have enough data to populate roles as well
    App.currentUserRoles = new App.Collections.CurrentUserRoles(
      App.Helpers.extractObject(data,'current_user_roles')
    );

    return result;
  }
});
