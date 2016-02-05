App.Collections.VacationRequests = Backbone.Collection.extend({
  url: '/vacation_requests',
  model: App.Models.VacationRequest,

  getVacationsDuration: function(holidays, filters) {
    var dateRange = {
          start:  moment({'year':filters.year, 'month':0,   'day':1 }).format('YYYY-MM-DD'),
          end:    moment({'year':filters.year, 'month':11,  'day':31}).format('YYYY-MM-DD'),
        };

    result = _.chain(this.models)
      .filter(function(vacation) {
        var hasProperDateRange = vacation.getStartMoment().year() === filters.year || vacation.getEndMoment().year() === filters.year,
            hasProperType = vacation.get('kind') === filters.type;
            hasProperStatus = vacation.get('status') === filters.status;

        return hasProperDateRange && hasProperType && hasProperStatus;
      })
      .reduce(function(memo, vacation) {
        return memo+vacation.calculateDuration(holidays, dateRange);
      }, 0)
      .value();

    return result;
  },

  toDates: function() {
    var result = [];

    result = this.models.map(function(model) {
      return model.toDates();
    });

    return _.flatten(result);
  }
});
