App.Views.ApprovalRequest = Backbone.View.extend({
  template: JST['templates/approval_request'],

  render: function() {
    console.log('ApprovalRequest:render');
    return this;
  },
});
