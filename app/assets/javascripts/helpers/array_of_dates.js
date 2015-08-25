// This method should be used as a detatched mathod, as follows:
//-----------------------------------------------------------------------------
// var model = new Backbone.Model({
//               'duration': 3,
//               'start':    '2015-09-01'
//             });
// App.Helpers.arrayOfDates.call(model);
//-----------------------------------------------------------------------------
// The helper expects object to be instance of Backbone.Model
// with 'duration' and 'start' attributes.
//
// Returns array of ISO 8601 dates, that is, formatted as 'YYYY-MM-DD'.
App.Helpers.arrayOfDates = function() {
  var count = 0,
      result = [];

  for (count = 0; count < this.get('duration'); count++) {
    result.push(moment(this.get('start')).add(count,'days').format('YYYY-MM-DD'));
  }

  return result;
};
