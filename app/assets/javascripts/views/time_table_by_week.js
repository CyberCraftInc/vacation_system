App.Views.TimeTableByWeek = Backbone.View.extend({
  el: '.time-table',
  template: JST['templates/time_table_by_week'],

  initialize: function(options) {
    var that = this;

    this.vacations = new App.Collections.TeamVacations({team_id: options.team_id});
    this.members = new App.Collections.TeamMembers(options.team_id);

    this.cellWidth = 20;
    this.timeTableDateRange = {
      begin:  new Date(),
      end:    new Date(),
    };

    this.updateTimeTableDateRange();

    this.render();
    this.$table = this.$('.time-table-by-week');

    this.listenTo(this.members,   'sync', this.renderMembersTable);

    this.members.fetch();
    this.vacations.fetch()
      .then(function(data) {
        that.renderVacationsTable(data);
      });
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  renderMembersTable: function() {
    var $list = this.$('.members tbody');
    $list.append('<tr><td>&nbsp;</td></tr>');
    $list.append('<tr><td>&nbsp;</td></tr>');
    this.members.each(function(model) {
      $list.append('<tr><td class="member">'+ model.composeFullName() +'</td></tr>');
    });
  },

  renderVacationsTable: function(vacations) {
    this.drawMonths();
    this.drawWeeks();
    this.drawEmptyTable();
    this.markVacations(vacations);
    return this;
  },

  drawMonths: function() {
    var $td = null,
        date = null,
        cellCounter = 0,
        monthFormat = "MMM (YYYY)",
        cols = this.getNumberOfWeeks(),
        month = moment(this.timeTableDateRange.begin).format(monthFormat);

    this.$table.css('width', this.calculateTableWidth());

    var $tr = $('<tr>').appendTo(this.$table);
    $tr.addClass('head');

    for (var col = 0; col < cols; col++) {
      date = moment(this.timeTableDateRange.begin).add(col,'weeks');
      if (date.format(monthFormat) !== month) {
        $td = $('<td>').appendTo($tr);
        $td.attr('colspan', 3*cellCounter);
        $td.text(month);
        month = date.format(monthFormat);
        cellCounter = 0;
      }
      cellCounter++;
    }

    if (cellCounter > 0) {
        $td = $('<td>').appendTo($tr);
        $td.attr('colspan', 3*cellCounter);
        $td.text(month);
    }
  },

  drawWeeks: function() {
    var $tr = null,
        $td = null,
        cols = this.getNumberOfWeeks(),
        beginDate = this.timeTableDateRange.begin;

    $tr = $('<tr>').appendTo(this.$table);
    $tr.addClass('head');

    for (var col = 0; col < cols; col++) {
      $td = $('<td>').appendTo($tr).attr('colspan','3');
      $td.text(moment(beginDate).add(col,'weeks').format('W'));
    }
  },

  drawEmptyTable: function() {
    var $tr = null,
        $td = null,
        date = null,
        cols = this.getNumberOfWeeks(),
        cellID = '';

    this.members.each( function(user) {
      $tr = $('<tr>').appendTo(this.$table);
      for (var col = 0; col < cols; col++) {
        date = moment(this.timeTableDateRange.begin).add(col,'weeks');
        cellID = user.attributes.id+'-'+date.format('YY-W');
        $td = $('<td>').appendTo($tr)
          .attr('id', cellID+'-planned')
          .addClass('left-cell');
        $td = $('<td>').appendTo($tr)
          .attr('id', cellID+'-unpaid');
        $td = $('<td>').appendTo($tr)
          .attr('id', cellID+'-sickness')
          .addClass('right-cell');
      }
    }, this);
  },

  markVacations: function(collection) {
    _.each(collection, function(vacations) {
      if (!_.isEmpty(vacations)) {
        _.each(vacations, function(vacation) {
          this.markVacation(vacation);
        }, this);
      }
    }, this);
  },

  markVacation: function(vacation) {
    var date = null,
        endDate = null,
        weekRange = null,
        weekendCounter = 0,
        vacationRange = null,
        beginDate = moment(vacation.start, 'YYYY-MM-DD'),
        duration  = vacation.duration,
        userID    = vacation.user_id,
        type      = vacation.kind;

    for (var i = 0; i < duration; i++) {
      date = moment(beginDate).add(i, 'days');
      if (App.Helpers.isWeekend(date.toDate())) {
        weekendCounter++;
      }
    }

    endDate = moment(beginDate).add(duration + weekendCounter, 'days');

    for (date = beginDate; date <= endDate; date.add(1,'weeks')) {
      selector = '#'+userID+'-'+date.format('YY-W')+'-'+type;
      $(selector).css('background-color', this.colorizeVacation(vacation));
    }
  },


  // ***************************** Helpers *************************************
  calculateTableWidth: function() {
    return this.getNumberOfWeeks() * this.cellWidth * 3;
  },

  updateTimeTableDateRange: function() {
    var now = new Date();
    this.timeTableDateRange.begin = new Date(now.getFullYear(),
                                             now.getMonth(),
                                             now.getDate());
    this.timeTableDateRange.end   = new Date(now.getFullYear(),
                                             now.getMonth() + 6,
                                             now.getDate());
  },

  getNumberOfWeeks: function() {
    var range = moment.range(this.timeTableDateRange.begin,
                             this.timeTableDateRange.end);

    return range.diff('weeks');
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
    var styles = {
      planned: 'dotted',
      unpaid: 'dashed',
      sickness: 'double'
    };
    return styles[vacation.kind];
  },
});
