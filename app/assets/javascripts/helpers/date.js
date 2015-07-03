// Convert JS Date object into UNIX timestamp
App.Helpers.dateToMS = function(date) {
  var result = 0;
  if (_.isDate(date)) {
    result = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate());
  }

  return result;
};

// Convert UNIX timestamp into number of days
App.Helpers.MsToNumberOfDays = function(ms) {
  var result = 0;
  if (_.isNumber(ms)) {
    result = ms / 1000 / 24 / 3600;
  }

  return result;
};

// Convert UNIX timestamp into number of days
App.Helpers.dateFromOffset = function(startDate, numberOfDays) {
  var result = null;

  if (_.isDate(startDate)) {
    result = new Date(startDate.getFullYear(),
                          startDate.getMonth(),
                          startDate.getDate() + numberOfDays);
  }
  return result;
};

// Convert JS Date object into ISO-8601 format, like 2015-07-16
App.Helpers.dateToISO_8601 = function(date) {
  var result = date.toJSON().slice(0,10);

  return result;
};

// TODO
App.Helpers.isWeekend = function(date) {
  var result = false;

  if (_.isDate(date)) {
    var isSaturday  = date.getDay() === 6;
    var isSunday    = date.getDay() === 0;
    result = isSaturday || isSunday;
  }

  return result;
};

// Provide month name from JS Date object
App.Helpers.getMonthNameFromDate = function(date) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return monthNames[date.getMonth()];
};