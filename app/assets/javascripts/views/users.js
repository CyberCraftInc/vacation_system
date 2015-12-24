App.Views.Users = Backbone.View.extend({
  el: 'section',
  template: JST['templates/users'],

  initialize: function(options) {
    this.users = options.users;

    this.data = {
      highestPrivilege: App.currentUserRoles.highestPrivilege()
    };

    this.$el.html(this.template());
    this.$users = $('.panel-group');
  },

  render: function() {
    if (this.data.highestPrivilege === 'admin') {
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
