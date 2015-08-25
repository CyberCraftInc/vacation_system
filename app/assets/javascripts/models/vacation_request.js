App.Models.VacationRequest = Backbone.Model.extend({
  urlRoot: 'vacation_requests',
  defaults: {
    'end':'',
    'duration':1,
    'kind':'planned',
    'start':'',
    'status':'requested',
  },

  // Calculate duration and set duration attribute with the result
  // Solution is based on sets of days and their unions and instersections.
  calculateDuration: function(holidays, options) {
    var result = 0,
        arrayOfHolidays = [],
        arrayOfVacationDays = [],
        arrayOfWeekends = [],
        numberOfDays = moment.duration(moment(this.get('end')).diff(moment(this.get('start')),'days'))+1;

    this.set('duration', numberOfDays);

    arrayOfHolidays = holidays.arrayOfDates();
    arrayOfVacationDays = App.Helpers.arrayOfDates.call(this);
    arrayOfWeekends = App.Helpers.arrayOfWeekends(this.get('start'), this.get('duration'));

    result = numberOfDays - _.intersection(_.union(arrayOfHolidays, arrayOfWeekends), arrayOfVacationDays).length;
    this.set('duration', result);
  }
});
