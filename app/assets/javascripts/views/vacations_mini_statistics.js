App.Views.VacationsMiniStatistics = Backbone.View.extend({
  el: '.new-vacation-request-form .panel-footer',
  template: JST['templates/vacations_mini_statistics'],

  events: {
      'click button[name=details]':  'onClickDetails',
  },

  initialize: function(options) {
    this.vacationType = options.vacationType;
    this.holidays = options.holidays;
    this.vacationRequests = options.vacationRequests;

    this.user = new App.Models.User();
    this.user.set(App.currentUser.attributes);

    this.statistics = this.getStatistics();
    this.isDetailsVisible = false;
    this.buttonText = {
      'show': 'Show detailed info',
      'hide': 'Hide detailed info'
    };
  },

  render: function() {
    if (_.contains(App.Vacation.types, this.vacationType)) {
      this.renderShortInfo();
      this.renderTable();
    } else {
      this.showInfo('Please select vacation type!');
    }

    return this;
  },

  getColumnsForRegular: function() {
    return [{
        field: 'year',
        title: 'Year',
        align: 'center',
        valign: 'middle',
        sortable: false
    }, {
        field: 'accumulated',
        title: 'Accumulated',
        align: 'center',
        valign: 'middle',
        width: '25%',
        sortable: false
    }, {
        field: 'requested',
        title: 'Requested',
        align: 'center',
        valign: 'middle',
        sortable: false
    }, {
        field: 'used',
        title: 'Used',
        align: 'center',
        valign: 'middle',
        sortable: false
    }, {
        field: 'remaining',
        title: 'Remaining',
        align: 'center',
        valign: 'middle',
        sortable: false
    }];
  },

  getColumnsForNotRegular: function() {
    return [{
        field: 'year',
        title: 'Year',
        align: 'center',
        valign: 'middle',
        sortable: false
    }, {
        field: 'accumulated',
        title: 'Available',
        align: 'center',
        valign: 'middle',
        width: '25%',
        sortable: false
    }, {
        field: 'requested',
        title: 'Requested',
        align: 'center',
        valign: 'middle',
        sortable: false
    }, {
        field: 'used',
        title: 'Used',
        align: 'center',
        valign: 'middle',
        sortable: false
    }, {
        field: 'remaining',
        title: 'Remaining',
        align: 'center',
        valign: 'middle',
        sortable: false
    }];
  },

  getTableColumns: function() {
    var result = [];

    if (this.vacationType === App.Vacation.types.regular) {
      result = this.getColumnsForRegular();
    } else if (this.vacationType === App.Vacation.types.sickness) {
      result = this.getColumnsForNotRegular();
    } else if (this.vacationType === App.Vacation.types.unpaid) {
      result = this.getColumnsForNotRegular();
    }

    return result;
  },

  getAvailableDays: function() {
    var result = 0;

    if (this.vacationType === App.Vacation.types.regular) {
      result = _.last(this.statistics).remaining;
    } else if (this.vacationType === App.Vacation.types.sickness) {
      result = _.first(this.statistics).remaining;
    } else if (this.vacationType === App.Vacation.types.unpaid) {
      result = _.first(this.statistics).remaining;
    }

    return parseInt(result);
  },

  onClickDetails: function(event) {
    var text = 'Error! Please inform your support team.';
    if (this.isDetailsVisible) {
      text = this.buttonText.show;
      this.$tableContainer.addClass('hidden');
    } else {
      text = this.buttonText.hide;
      this.$tableContainer.removeClass('hidden');
    }

    this.$button.html(text);
    this.isDetailsVisible = ! this.$tableContainer.hasClass('hidden');
  },

  renderShortInfo: function() {
    var content = this.template({
          'available': this.getAvailableDays(),
          'requested': this.statistics[0].requested,
          'used': this.statistics[0].used,
          'buttonText': this.isDetailsVisible ? this.buttonText.hide: this.buttonText.show
        });

    this.$el.html(content);
    this.$button = this.$('button[name=details]');
    this.$table = this.$('.table');
    this.$tableContainer = this.$('.extended');
    if (this.isDetailsVisible) {
      this.$tableContainer.removeClass('hidden');
    }
  },

  renderTable: function() {
    this.$table.bootstrapTable({
      search: false,
      toolbar: '.usersTableToolbar',
      data: this.statistics,
      columns: this.getTableColumns()
    });
  },

  getStatistics: function() {
    var years = App.currentUser.getYearsOfEmployment(),
        filters = {},
        accumulated = 0.0,
        requested = 0,
        used = 0,
        remaining = 0.0,
        result = [];

    filters.type = this.vacationType;
    years.forEach(function(year) {
      filters.year = year;

      filters.status = App.Vacation.statuses.requested;
      accumulated = parseInt(this.user.calculateAccumulatedVacations(filters));

      filters.status = App.Vacation.statuses.requested;
      requested = this.vacationRequests.getVacationsDuration(this.holidays, filters);

      filters.status = App.Vacation.statuses.used;
      used      = this.vacationRequests.getVacationsDuration(this.holidays, filters);

      result.unshift({
        'year': year,
        'accumulated': accumulated,
        'requested': requested,
        'used': used,
        'remaining': accumulated - used,
      });
    }, this);

    result = this.getStatisticsInTotal(result);

    return result;
  },

  getStatisticsInTotal: function(data) {
    var result = data,
        sum = function(column) {
          return _.pluck(data, column).reduce(function(pv,cv) {return pv+cv;});
        };

    result.push({
      'year':         'Total',
      'accumulated':  parseInt(sum('accumulated')),
      'requested':    sum('requested'),
      'used':         sum('used'),
      'remaining':    sum('remaining'),
    });

    return result;
  },

  showInfo: function(message) {
    this.$el.html(JST['templates/alerts/info']({'message':message}));
  },

  showError: function(message) {
    this.$el.html(JST['templates/alerts/error']({'message':message}));
  },

  update: function(vacationType) {
    this.vacationType = vacationType;
    this.statistics = this.getStatistics();
    this.render();
  }
});
