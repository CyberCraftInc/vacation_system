App.Models.User = Backbone.Model.extend({
  urlRoot: 'users',
  defaults: {
    'first_name':'',
    'last_name':'',
    'email':'',
    'position':'',
    'username':'',
    'birth_date':'1990-01-01',
    'employment_date': moment(new Date()).format('YYYY-MM-DD')
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
    expected_keys.push('id', 'invitation_accepted_at', 'created_at', 'updated_at');

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
      message = 'App.Models.User.set: option {match: true} allows to set only properties from defaults (';
      message +=_.keys(this.defaults)+')';
      message += ', but got (';
      message += forbidden_keys;
      message += ')';
      console.log(message);
      throw new Error(message);
    }

    return Backbone.Model.prototype.set.apply(this, arguments);
  },

  composeFullName: function() {
    var result = '',
        value = this.get('first_name');

    if (_.isString(value)) {
      result = value.trim();
    }

    value = this.get('last_name');
    if (_.isString(value)) {
      result = result.concat(' ' + value.trim());
    }

    return result;
  },

  // Get roles for the user in the provided team.
  // The following input data are expected:
  //  - ID of team, integer
  //  - App.Collections.Roles instance
  // Returns array of App.Models.Role.
  getRolesInTeam: function(teamID, roles) {
    var result = [];

    result = roles.filter(function(role) {
      var isRoleOwner = (role.get('user_id') === this.get('id')),
          isAssignedToTeam = (teamID === role.get('team_id'));

      return (isRoleOwner && isAssignedToTeam);
    }, this);

    return result;
  },

  // Available Vacations =======================================================
  calculateAccumulatedVacations: function(filters) {
    var result = 0.0;

    if (filters.type === App.Vacation.types.regular) {
      result = this.calculateAccumulatedRegularVacations(filters);
    } else if (filters.type === App.Vacation.types.sickness) {
      result = 20;
    } else if (filters.type === App.Vacation.types.unpaid) {
      result = 10;
    }

    return result;
  },

  calculateAccumulatedRegularVacations: function(filters) {
    var result = 0.0,
        rate = 20/365;

    if (_.isUndefined(filters) || _.isUndefined(filters.year)) {
      result = rate * this.calculateTotalEmploymentDuration();
    } else {
      result = rate * this.calculateEmploymentDuration(parseInt(filters.year));
    }

    return result;
  },

  calculateEmploymentDuration: function(year) {
    var result = 0,
        curretYear = moment().year(),
        dateFormat = App.Helpers.getDateFormat(),
        employmentDate = moment(this.get('employment_date'), dateFormat),
        employmentYear = employmentDate.year(),
        isFirstYear = false,
        isInitialYear = false,
        isLastYear = false,
        startDate = moment([year, 0, 1]),
        endDate = moment([year,11,31]),
        today = moment();

    isFirstYear   = year === employmentYear;
    isLastYear    = year === curretYear;
    isInitialYear = isFirstYear && isLastYear;

    if (isInitialYear) {
      result = App.Helpers.dateRangeDuration(employmentDate, today);
    } else if (isFirstYear) {
      result = App.Helpers.dateRangeDuration(employmentDate, endDate);
    } else if (isLastYear) {
      result = App.Helpers.dateRangeDuration(startDate, today);
    } else {
      result = App.Helpers.getNumberOfDaysInYear(year);
    }

    return result;
  },

  calculateTotalEmploymentDuration: function(year) {
    var result = 0,
        dateFormat = App.Helpers.getDateFormat(),
        startDate = moment(this.get('employment_date'), dateFormat),
        today = moment();

    result = App.Helpers.dateRangeDuration(startDate, today);

    return result;
  },

  // Validations ===============================================================
  validation: {
    first_name: {
      required: true,
      rangeLength: [1, 50]
    },
    last_name: {
      required: true,
      rangeLength: [1, 70]
    },
    email: {
      required: true,
      pattern: 'email',
    },
    birth_date: {
      required: true,
      length: 10
    },
    employment_date: {
      required: true,
      length: 10
    },
  }
});
