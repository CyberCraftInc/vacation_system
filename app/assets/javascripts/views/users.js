App.Views.Users = Backbone.View.extend({
  el: 'section',
  template: JST['templates/users'],

  initialize: function(options) {
    this.users = options.users;

    this.$el.html(this.template());
    this.$users = $('.panel-group');
  },

  render: function() {
    if (App.currentUserRoles.highestPrivilege() === App.TeamRoles.admin) {
      this.renderTable();
    } else {
      this.showError('Access denied');
    }

    return this;
  },

  renderTable: function() {
    this.table = new App.Views.UsersList({
      'users': this.users
    });

    this.table.render();
  },

  showError: function(message) {
    this.$el.html(JST['templates/alerts/error']({'message':message}));
  }
});
