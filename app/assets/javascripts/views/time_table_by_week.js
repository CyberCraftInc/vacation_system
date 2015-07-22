App.Views.TimeTableByWeek = Backbone.View.extend({
  el: '.time-table',
  template: JST['templates/time_table_by_week'],

  initialize: function(options) {
    var that = this;

    this.vacations = new App.Collections.TeamVacations({team_id: options.team_id});
    this.members = new App.Collections.TeamMembers(options.team_id);

    this.cellWidth  = 20;
    this.colSpan    = 5;
    this.timeTableDateRange = {
      begin:  new Date(),
      end:    new Date(),
    };

    this.updateTimeTableDateRange();

    this.render();
    this.$table = this.$('.time-table-by-week');

    this.listenTo(this.members,   'sync', this.renderMembersTable);
    this.listenTo(this.vacations, 'sync', this.renderVacationsTable);

    this.members.fetch({
      success: function() {
        that.vacations.fetch();
      }
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

  renderVacationsTable: function() {
    this.drawMonths();
    this.drawWeeks();
    this.drawEmptyTable();
    this.markVacations();
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
        $td.attr('colspan', this.colSpan*cellCounter);
        $td.text(month);
        month = date.format(monthFormat);
        cellCounter = 0;
      }
      cellCounter++;
    }

    if (cellCounter > 0) {
        $td = $('<td>').appendTo($tr);
        $td.attr('colspan', this.colSpan*cellCounter);
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
      $td = $('<td>').appendTo($tr).attr('colspan', this.colSpan);
      $td.text(moment(beginDate).add(col,'weeks').format('W'));
    }
  },

  drawEmptyTable: function() {
    var $tr = null,
        $td = null,
        date = null,
        cols = this.getNumberOfWeeks(),
        weekStart = moment(this.timeTableDateRange.begin).startOf('isoweek'),
        cellID = '';

    this.members.each( function(user) {
      $tr = $('<tr>').appendTo(this.$table);
      for (var col = 0; col < cols; col++) {
        date = moment(weekStart).add(col,'weeks');
        // Mark first day of week
        cellID = user.attributes.id+'-'+date.format('YY-MM-DD');
        $td = $('<td>').appendTo($tr)
          .attr('id', cellID)
          .addClass('left-cell');
        // Three days
        for (var i = 0; i < 3; i++) {
          cellID = user.attributes.id+'-'+date.add(1,'day').format('YY-MM-DD');
          $td = $('<td>').appendTo($tr)
            .attr('id', cellID);
        }
        // Mark last day of week
        cellID = user.attributes.id+'-'+date.add(1,'day').format('YY-MM-DD');
        $td = $('<td>').appendTo($tr)
          .attr('id', cellID)
          .addClass('right-cell');
      }
    }, this);
  },

  markVacations: function() {
    this.vacations.each(function(vacations) {
      if (!vacations.isEmpty()) {
        vacations.values().forEach(function(vacation) {
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
        beginDate = moment(vacation.start),
        duration  = vacation.duration,
        userID    = vacation.user_id,
        type      = vacation.kind;

    for (date = beginDate.clone(); date < moment(beginDate).add(duration, 'days'); date.add(1, 'day')) {
      if (App.Helpers.isWeekend(date.toDate())) {
        duration++;
        continue;
      }
      selector = '#'+userID+'-'+date.format('YY-MM-DD');
      $(selector).addClass(vacation.kind);
      $(selector).addClass(vacation.status);
    }
  },


  // ***************************** Helpers *************************************
  calculateTableWidth: function() {
    return this.getNumberOfWeeks() * this.cellWidth * this.colSpan;
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
  }
});
