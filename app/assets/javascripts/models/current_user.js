App.Models.CurrentUser = Backbone.Model.extend({
  getYearsOfEmployment: function() {
    var startYear = moment(this.get('employment_date'), 'YYYY-MM-DD').year(),
        endYear = moment().year();

    return _.range(startYear, endYear+1);
  }
});
