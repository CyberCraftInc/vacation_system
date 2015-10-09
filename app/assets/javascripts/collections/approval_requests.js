App.Collections.ApprovalRequests = Backbone.Collection.extend({
  url: function () {
    var userID = App.currentUser.get('id').toString();
    return 'users/'+userID+'/approval_requests';
  },
  model: App.Models.ApprovalRequest
});
