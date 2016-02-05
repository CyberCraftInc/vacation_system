// The urlRoot should be 'vacation_requests', to work with pure vacation request
// record.
App.Models.VacationRequest = Backbone.Model.extend({
  defaults: {
    'kind': App.Vacation.types.regular,
    'status': App.Vacation.statuses.requested,
    'start_date':'',
    'end_date':'',
  },

  get: function(attribute) {
    if (typeof this[attribute] == 'function') {
      return this[attribute]();
    }
    return Backbone.Model.prototype.get.call(this, attribute);
  },

  set: function() {
    var options = {match: true},
        new_keys = [],
        expected_keys = _.keys(this.defaults),
        forbidden_keys = [];

    // Attributes that are not expected by backend in case of a new record,
    // but it is Ok to initialize a model with these attributes.
    expected_keys.push('id', 'user_id', 'created_at', 'updated_at');

    if (_.isObject(arguments[0])) {
      options = _.extend(options, arguments[1]);
      new_keys = _.keys(arguments[0]);
      forbidden_keys = _.reject(new_keys, function(key) {
        return _.contains(expected_keys, key);
      });
    } else {
      options = _.extend(options, arguments[2]);
      new_keys = [arguments[0]];
      forbidden_keys = _.reject(new_keys, function(key) {
        return _.contains(expected_keys, key);
      });
    }

    if (options.match === true && !_.isEmpty(forbidden_keys)) {
      message = 'App.Models.VacationRequest.set: option {match: true} allows to set only properties from defaults (';
      message +=_.keys(this.defaults)+')';
      message += ', but got (';
      message += forbidden_keys;
      message += ')';
      console.log(message);
      throw new Error(message);
    }

    return Backbone.Model.prototype.set.apply(this, arguments);
  },

  // Calculate duration and return the result.
  // Solution is based on sets of days and their unions and instersections.
  calculateDuration: function(holidays, dateRange) {
    var result = 0,
        arrayOfHolidays = [],
        arrayOfVacationDays = [],
        arrayOfWeekends = [],
        start_date = this.get('start_date'),
        end_date = this.get('end_date'),
        duration = 0;


    if (_.isObject(dateRange)) {
      if (start_date < dateRange.start) {
        start_date = dateRange.start;
      }

      if (end_date > dateRange.end) {
        end_date = dateRange.end;
      }
    }

    duration = App.Helpers.dateRangeDuration(start_date, end_date);

    arrayOfHolidays = holidays.arrayOfDates();
    arrayOfVacationDays = App.Helpers.arrayOfDates(start_date, duration);
    arrayOfWeekends = App.Helpers.arrayOfWeekends(start_date, duration);

    result = duration - _.intersection(_.union(arrayOfHolidays, arrayOfWeekends), arrayOfVacationDays).length;

    return result;
  },

  getEndMoment: function() {
    return moment(this.get('end_date'));
  },

  getStartMoment: function() {
    return moment(this.get('start_date'));
  },

  toDates: function() {
    var result = [],
        date = moment(this.get('start_date'), App.Helpers.getDateFormat()),
        isoDate = date.format(App.Helpers.getDateFormat());

    while (isoDate <= this.get('end_date')) {
      result.push(isoDate);
      isoDate = date.add(1, 'day').format(App.Helpers.getDateFormat());
    }

    return result;
  },

  // Validation ================================================================
  validation: {
    kind: {
      required: true,
      oneOf: _.values(App.Vacation.types)
    },
    status: {
      required: true,
      oneOf: _.values(App.Vacation.statuses)
    },
    start_date: {
      required: true,
      pattern: /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
    },
    end_date: {
      required: true,
      pattern: /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/
    }
  }
});
