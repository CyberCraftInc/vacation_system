//
App.Helpers.getDateFormat = function() {
  return 'YYYY-MM-DD';
};

// Provide number of days in year
App.Helpers.getNumberOfDaysInYear = function(year) {
  return moment([parseInt(year)]).isLeapYear() ? 366: 365;
};

// Verify if provided date is a weekend
App.Helpers.isWeekend = function(date) {
  var result = false;

  date = moment(date).toDate();
  if (_.isDate(date)) {
    var isSaturday  = date.getDay() === 6;
    var isSunday    = date.getDay() === 0;
    result = isSaturday || isSunday;
  }

  return result;
};

// Verify if provided date is included in provided array of holidays dates
App.Helpers.isHoliday = function(date, holidays) {
  var result = false;

  date = date.toDate();
  if (_.isDate(date)) {
    date = moment(date).format('YYYY-MM-DD');
    result = _.contains(holidays, date);
  }

  return result;
};

// Calculate duration in days
App.Helpers.dateRangeDuration = function(fromDate, toDate) {
  return moment(toDate, 'YYYY-MM-DD').diff(moment(fromDate, 'YYYY-MM-DD'), 'days') + 1;
};
