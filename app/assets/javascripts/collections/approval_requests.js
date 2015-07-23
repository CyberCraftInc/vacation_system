App.Collections.ApprovalRequests = Backbone.Collection.extend({
  url: '/approval_requests/',
  model: App.Models.ApprovalRequest,

  initialize: function( options ) {
    if (!_.isUndefined(options)) {
      this.updateURL(options);
    }
  },

  updateURL: function( options ) {
    if (!_.isUndefined(options.user_id)) {
      this.url = function() {
        return '/users/' + options.user_id.toString() + '/requested_vacations/';
      };
    }
  }
});
