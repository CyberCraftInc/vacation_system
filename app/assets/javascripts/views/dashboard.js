App.Views.Dashboard = Backbone.View.extend({
  el: 'section',
  template: JST['templates/dashboard'],

  events: {
    'change input[name=teams]': 'onTeamToggle',
  },

  initialize: function(options) {
    this.options = options;
    this.holidays = options.holidays;
    this.teams = options.teams;
    this.teamID = 0;
    this.data = {role:'', teams:[]};
    this.data.role = 'admin';
    // this.data.role = App.currentUserRoles.highestPrivilege();

    this.listenTo(this.options.approvalRequests, 'sync', this.render);
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
    this.personalRequests = new App.Views.PersonalVacationRequests(this.options);
    this.personalRequests.render();
  },

  renderPendingRequests: function() {
    this.pendingRequests = new App.Views.ApprovalRequests(this.options);
    this.pendingRequests.render();
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
    if (App.currentUserRoles.hasRole(App.TeamRoles.manager)) {
      this.$('.pending-requests').show();
      this.renderPendingRequests();
    } else {
      this.$('.pending-requests').hide();
      if (!_.isUndefined(this.pendingRequests)) {
        this.pendingRequests.remove();
        delete this.pendingRequests.remove;
      }
    }
  }
});
