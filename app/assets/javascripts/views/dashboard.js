App.Views.Dashboard = Backbone.View.extend({
  el: 'section',
  template: JST['templates/dashboard'],

  events: {
    'change select[name=teams]':          'onTeams',
  },

  initialize: function( options ) {
    this.teams = new App.Collections.Teams();
    this.teamID = 0;
    this.attributes = {role:''};

    this.listenTo(this.teams,  'sync',  this.render);

    this.teams.fetch();
  },

  render: function() {
    var userTeams = App.currentUserRoles.teams();
    var filteredTeams = this.teams.filter(function(item) {
      return _.contains(userTeams, item.id);
    });

    this.attributes.teams = filteredTeams;

    this.$el.html(this.template(this.attributes));
    this.$('select[name=teams]').trigger('change');
    // this.updateUsersRequestsVisibility();
    // this.renderPersonalRequests();
    return this;
  },

  onTeams: function( e ) {
    this.teamID = parseInt(e.target.value);
    this.attributes.role = App.currentUserRoles.roleFromTeamID(this.teamID);
    // this.updateUsersRequestsVisibility();
    this.renderTimeTable();
  },

  renderPersonalRequests: function() {
    var userID = App.currentUser.get('id');
    var options = {
      user_id:userID,
      el:'.personal-requests .panel-body',
      columns: [{
          field: 'start',
          title: 'Start date',
          sortable: true
      }, {
          field: 'duration',
          title: 'Duration',
          sortable: true
      }, {
          field: 'kind',
          title: 'Type',
          sortable: true
      }],
    };
    this.personalRequests = new App.Views.ApprovalRequests(options);
  },

  renderPendingRequests: function() {
    var options = {
      el:'.pending-requests .panel-body',
      columns: [{
          field: 'start',
          title: 'Start date',
          sortable: true
      }, {
          field: 'duration',
          title: 'Duration',
          sortable: true
      }, {
          field: 'kind',
          title: 'Type',
          sortable: true
      }, {
          field: 'id',
          title: 'User ID',
          sortable: true

      }],
    };
    this.pendingRequests = new App.Views.ApprovalRequests(options);
  },

  renderTimeTable: function() {
    var options = {team_id: this.teamID};
    if (_.isUndefined(this.timeTable)) {
      this.timeTable = new App.Views.TimeTable(options);
    } else {
      this.timeTable.update(options.team_id);
    }
  },

  updateUsersRequestsVisibility: function() {
    if (this.attributes.role === 'manager') {
      this.$('.pending-requests').show();
      this.renderPendingRequests();
    } else {
      this.$('.pending-requests').hide();
      if (!_.isUndefined(this.pendingRequests)) {
        this.pendingRequests.remove();
        delete this.pendingRequests.remove;
      }
    }
  },
});
