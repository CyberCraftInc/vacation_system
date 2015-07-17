App.Views.TimeTables = Backbone.View.extend({
  el: '#time-table-content',
  template: JST['templates/time_tables'],

  events: {
    // 'change select[name=teams]':          'onTeams',
  },

  initialize: function( options ) {
    this.members = new App.Collections.TeamMembers(options.team_id);
    this.listenTo(this.members,  'sync',  this.render);
    this.members.fetch();
    this.attributes = {};
    this.attributes.team_id = options.team_id;
    this.timeTableDateRange = {};

  },

  render: function() {
    this.renderTemplate();
    this.renderTeamMembersList();
    // this.renderTimeTableByDay();
    this.renderTimeTableByWeek();
    return this;
  },


  update: function( teamID ) {
    delete this.members;
    this.updateTeamMembersList(teamID);
    this.attributes.team_id = teamID;
    this.renderTemplate();
    return this;
  },

  renderTemplate: function() {
    this.$el.html(this.template(this.attributes));
  },

  // TODO: move to the model
  composeFullName: function(model) {
    var result = '';
    var value = model.attributes.first_name;
    if (_.isString(value)) {
      result = value.trim();
    }
    value = model.attributes.last_name;
    if (_.isString(value)) {
      result.concat(' ' + value.trim());
    }
    return result;
  },

  // *************************************************************************
  renderTeamMembersList: function() {
    var $list = $('.members tbody');
    $list.append('<tr><td>&nbsp;</td></tr>');
    $list.append('<tr><td>&nbsp;</td></tr>');
    this.members.each(function(model) {
      // TODO: crete dedicated model with a view
      $list.append('<tr><td class="member">'+ this.composeFullName(model) +'</td></tr>');
    }, this);
  },

  updateTimeTableDateRange: function() {
    // code here
    var now = new Date();
    this.timeTableDateRange.begin = new Date(now.getFullYear(),
                                             now.getMonth(),
                                             now.getDate());
    this.timeTableDateRange.end   = new Date(now.getFullYear(),
                                             now.getMonth() + 6,
                                             now.getDate());
  },

  isVacation: function(date, userID) {
    // code here
  },

  calculateTableWidth: function(cellWidth) {
    return this.getNumberOfDays() * cellWidth;
  },

  getNumberOfDays: function() {
    var beginDateMS = App.Helpers.dateToMS(this.timeTableDateRange.begin);
    var endDateMS   = App.Helpers.dateToMS(this.timeTableDateRange.end);
    var durationMS  = endDateMS - beginDateMS;

    return App.Helpers.MsToNumberOfDays(durationMS);
  },

  colorizeVacation: function(vacation) {
    var colors = {
      requested: 'gold',
      accepted: 'skyblue',
      inprogress: 'lime'
    };
    return colors[vacation.status];
  },

  styleVacation: function(vacation) {
    var colors = {
      planned: 'dotted',
      unpaid: 'dashed',
      sickness: 'double'
    };
    return colors[vacation.kind];
  },

  markVacation: function(vacation) {
    var duration = vacation.duration;
    var startDate = new Date(vacation.start);
    var userID = vacation.user_id;
    var day = 0;

    for (var i = 0; i < duration; i++) {
      date = App.Helpers.dateFromOffset(startDate, i);
      if (App.Helpers.isWeekend(date)) {
        duration++;
        continue;
      }
      selector = '#'+userID+'-'+App.Helpers.dateToISO_8601(date);
      $(selector).css('background-color', this.colorizeVacation(vacation));
      $(selector).css('border-style', this.styleVacation(vacation));
    }
  },

  markVacations: function( collection ) {
    _.each(collection, function(vacations) {
      if (!_.isEmpty(vacations)) {
        _.each(vacations, function(vacation) {
          this.markVacation(vacation);
        }, this);
      }
    }, this);
  },

  drawMonths: function() {
    var cols = this.getNumberOfDays();
    var cellSize = 20;
    var tableWidth = this.calculateTableWidth(cellSize);
    var start = this.timeTableDateRange.begin;
    var year = start.getFullYear();
    var month = App.Helpers.getMonthNameFromDate(start);
    var cellCounter = 0;
    var $td = null;

    $('#time-table').css('width', tableWidth);

    var $tr = $('<tr>').appendTo(this.$table);
    $tr.addClass('months');

    for (var col = 0; col < cols; col++) {
      date  = App.Helpers.dateFromOffset(start, col);
      if (App.Helpers.getMonthNameFromDate(date) !== month) {
        $td = $('<td>').appendTo($tr);
        $td.attr('colspan',cellCounter);
        $td.text(month+' ('+year+')');
        month = App.Helpers.getMonthNameFromDate(date);
        year = date.getFullYear();
        cellCounter = 0;
      }
      cellCounter++;
    }

    if (cellCounter > 0) {
        $td = $('<td>').appendTo($tr);
        $td.attr('colspan',cellCounter);
        $td.text(month+' ('+year+')');
    }
  },

  drawDays: function() {
    var cols = this.getNumberOfDays();
    var cellSize = 25;
    var tableWidth = this.calculateTableWidth(cellSize);
    var start = this.timeTableDateRange.begin;
    var day = 0;
    var $td = null;

    var $tr = $('<tr>').appendTo(this.$table);
    $tr.addClass('days');

    for (var col = 0; col < cols; col++) {
      date  = App.Helpers.dateFromOffset(start, col);
      day   = date.getDate();
      $td = $('<td>').appendTo($tr);
      $td.text(day);

      if (App.Helpers.isWeekend(date)) {
        $td.css('background-color: grey');
      }
    }
  },

  drawEmptyTable: function() {
    var cols = this.getNumberOfDays();
    var cellSize = 20;
    var tableWidth = this.calculateTableWidth(cellSize);
    var start = this.timeTableDateRange.begin;
    var userID = 0;
    var date = 0;
    var cellID = '';
    var style = '';
    var $tr = null;
    var $td = null;

    this.members.each( function(user) {
      userID = user.attributes.id;
      $tr = $('<tr>').appendTo(this.$table);
      for (var col = 0; col < cols; col++) {
        date = App.Helpers.dateFromOffset(start, col);
        cellID = userID+'-'+App.Helpers.dateToISO_8601(date);
        $td = $('<td>').appendTo($tr);
        $td.attr('id',cellID);
        if (App.Helpers.isWeekend(date)) {
          $td.css('background-color','grey');
        }
      }
    }, this);
  },

  drawTableCaption: function() {
    this.drawMonths();
    this.drawDays();
  },

  drawTable: function( collection ) {
    this.updateTimeTableDateRange();
    this.drawTableCaption();
    this.drawEmptyTable();
    this.markVacations(collection);
  },

  renderTimeTableByDay: function() {
    var that = this;
    this.$table = $('#time-table tbody');
    var vacations = new App.Collections.TeamVacations({team_id: this.attributes.team_id});
    vacations.fetch()
      .then(function(data) {
        that.drawTable(data);
      });
  },

  renderTimeTableByWeek: function() {
    var that = this;
    this.$table = $('#time-table tbody');
    this.timeTableByWeek = new App.Views.TimeTableByWeek({team_id: this.attributes.team_id});
  },
  // *************************************************************************

  updateTeamMembersList: function( teamID ) {
    if (!_.isUndefined(this.members)) {
      delete this.members;
    }
    this.members = new App.Collections.TeamMembers(teamID);
    this.members.fetch();
  },

});
