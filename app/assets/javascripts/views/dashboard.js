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
    this.data.role = App.currentUserRoles.highestPrivilege();
  },

  render: function() {
    var userTeamIDs = App.currentUserRoles.teams();

    this.data.teams = this.teams.getTeamsByIDs(userTeamIDs);

    this.$el.html(this.template(this.data));

    this.renderMyRequests();
    this.renderRequestsToApprove();
    this.renderTimeTable();

    return this;
  },

  renderMyRequests: function() {
    this.personalRequests = new App.Views.MyRequests(this.options);
    this.personalRequests.render();
  },

  renderRequestsToApprove: function() {
    this.requestsToApprove = new App.Views.RequestsToApprove(this.options);
    this.requestsToApprove.render();
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

    this.renderTimeTable();
  }
});
