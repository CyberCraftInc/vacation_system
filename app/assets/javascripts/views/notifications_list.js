App.Views.NotificationsList = Backbone.View.extend({
  el: '.notification-list',
  template: JST['templates/notifications_list'],

  events: {
    'click button[name=add]':  'onClickAdd',
  },

  operationsEvents: function() {
    return {
      'click button[name=delete]':  this.onClickDelete,
      'click button[name=edit]':    this.onClickEdit,
    };
  },

  initialize: function(options) {
    this.notifications = options.notifications;
    this.teams = options.teams;
    this.notification_teams = options.notification_teams;

    this.listenTo(this.notifications, 'sync',  this.updateTable);

    this.onClickEdit = _.bind(this.onClickEdit, this);
    this.onClickDelete = _.bind(this.onClickDelete, this);
  },

  render: function() {
    this.$el.html(this.template());

    this.$table = this.$('table.users');

    this.renderTable();

    return this;
  },

  renderTable: function() {
    this.$table.bootstrapTable({
      search: true,
      toolbar: '.usersTableToolbar',
      data: this.notifications.toJSON(),
      columns: [{
        field: 'notification_type',
        title: 'Notification Type',
        valign: 'middle',
        sortable: true
      }, {
        field: 'timer_days',
        title: 'Notification Period',
        valign: 'middle',
        sortable: true
      }, {
        field: 'operations',
        title: 'Operations',
        align: 'center',
        events: this.operationsEvents(),
        formatter: this.operationsFormatter,
        width: '15%',
        sortable: false
      }]
    });
  },

  updateTable: function() {
    this.$table
        .bootstrapTable('load', {
          data: this.notifications.toJSON(),
        });
  },

  onClickAdd: function() {
    var notification = new App.Models.Notification(),
        title = 'New Notification Details';

    this.processModalForm(notification, title, this.notification_teams);
  },

  onClickEdit: function(event, value, row, index) {
    var notification = this.notifications.get(row.id),
        title = 'Edit Notification Details ';

    var teams = this.getArrayOfTeams(notification);

    console.log(this.notification_teams);
    this.processModalUpdateForm(notification, title, teams, this.notification_teams);
  },

  getArrayOfTeams: function(notification) {
    console.log(notification);

    var teamsInNotification = notification.getTeamsInNotification(this.teams, this.notification_teams);
    console.log(teamsInNotification);
    return teamsInNotification.join(',');
  },

  getUserDeleteConfirmation: function(user) {
    var message = '';

    message+='You are about to delete <'+user.attributes.notification_type+'> from DB, for ever.\n';
    message+='NOTE: All the user related things like vacations and approvals will be deleted as well.';
    return confirm(message);
  },

  onClickDelete: function(event, value, row, index) {
    var confirmed = false,
        userToDelete = this.notifications.get(row.id);

    confirmed = this.getUserDeleteConfirmation(userToDelete);
    if (confirmed) {
      this.listenToOnce(userToDelete, 'sync', this.onUserDeleteSuccess);
      userToDelete.destroy();
    }
  },

  onUserDeleteSuccess: function(model) {
    this.$table.bootstrapTable('remove', {field: 'id', values: [model.get('id')]});
  },


  processModalForm: function(notification, title, teams_collection) {
    var modal = new App.Views.NotificationForm({
      'title': title,
      'notification': notification,
      'collection': this.notifications,
      'teams': this.teams,
      'teams_collection': teams_collection
    });

    $('.user-form').html(modal.render().$el);

    $('#theModal').modal();

    $(":checkbox").prop('checked', false).parent().removeClass('active');
  },

  processModalUpdateForm: function(notification, title, teams, teams_collection) {

    var modal = new App.Views.NotificationUpdateForm({
      'title': title,
      'notification': notification,
      'collection': this.notifications,
      'teams': this.teams,
      'notification_teams': teams,
      'teams_collection': teams_collection
    });

    $('.user-form').html(modal.render().$el);

    $('#theModal').modal();
  },

  operationsFormatter: function(value, row, index) {
    var buttons = [];

    buttons.push(JST['templates/operations/users/edit']());
    buttons.push(JST['templates/operations/users/delete']());

    return buttons.join('&nbsp;');
  }
});
