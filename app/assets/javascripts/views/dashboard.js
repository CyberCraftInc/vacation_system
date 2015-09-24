App.Views.Dashboard = Backbone.View.extend({
  el: 'section',
  template: JST['templates/dashboard'],

  events: {
    'change input[name=teams]': 'onTeamToggle',
  },

  initialize: function(options) {
    this.holidays = options.holidays;
    this.teams = options.teams;
    this.teamID = 0;
    this.data = {role:'', teams:[]};
    this.data.role = App.currentUserRoles.highestPrivilege();

    this.listenTo(this.teams, 'sync', this.render);
  },

  render: function() {
    var userTeamIDs = App.currentUserRoles.teams();

    this.data.teams = this.teams.getTeamsByIDs(userTeamIDs);

    this.$el.html(this.template(this.data));

    this.renderPersonalRequests();
    this.updateUsersRequestsVisibility();
    this.renderTimeTable();

    return this;
  },

  renderPersonalRequests: function() {
    var userID = App.currentUser.get('id');
    var options = {
      user_id:userID,
      el:'.personal-requests .panel-body',
      columns: [{
          field: 'start_date',
          title: 'Start date',
          sortable: true
      }, {
          field: 'actual_end_date',
          title: 'End date',
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
          field: 'start_date',
          title: 'Start date',
          sortable: true
      }, {
          field: 'actual_end_date',
          title: 'End date',
          sortable: true
      }, {
          field: 'kind',
          title: 'Type',
          sortable: true
      }, {
          field: 'user_id',
          title: 'User ID',
          sortable: true

      }],
    };
    this.pendingRequests = new App.Views.ApprovalRequests(options);
  },

  renderTimeTable: function() {
    var options = {'teams': this.data.teams, 'holidays': this.holidays};
        options.from  = moment();
        options.to    = moment().add(2,'months');

    if (_.isUndefined(this.timeTables)) {
      this.timeTables = new App.Views.TimeTables(options);
    } else {
      this.timeTables.update(options.teams);
    }
  },

  onTeamToggle: function(event) {
    var teamIDs = [],
        toBeAdded = false;

    this.$('input[name=teams]').each(function(index, input) {
      toBeAdded = $(input).prop('checked');
      if (toBeAdded) {
        teamIDs.push(parseInt($(input).prop('value')));
      }
    });

    this.data.teams = this.teams.getTeamsByIDs(teamIDs);

    this.updateUsersRequestsVisibility();
    this.renderTimeTable();
  },

  updateUsersRequestsVisibility: function() {
    if (this.data.role === 'manager') {
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
