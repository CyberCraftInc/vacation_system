App.Views.Notifications = Backbone.View.extend({
  el: 'section',
  template: JST['templates/notifications'],

  initialize: function(options) {
    this.notifications = options.notifications;
    this.teams = options.teams;
    this.notification_teams = options.notification_teams;

    this.$el.html(this.template());
    this.$notifications = $('.panel-group');
  },

  render: function() {
    this.renderTable();

    return this;
  },

  renderTable: function() {
    this.table = new App.Views.NotificationsList({
      'notifications': this.notifications,
      'teams': this.teams,
      'notification_teams': this.notification_teams
    });

    this.table.render();
  }
});
