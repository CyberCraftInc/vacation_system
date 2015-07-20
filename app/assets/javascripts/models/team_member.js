App.Models.TeamMember = Backbone.Model.extend({
  composeFullName: function() {
    var result = '';
    var value = this.get('first_name');
    if (_.isString(value)) {
      result = value.trim();
    }
    value = this.get('last_name');
    if (_.isString(value)) {
      result.concat(' ' + value.trim());
    }
    return result;
  }
});
