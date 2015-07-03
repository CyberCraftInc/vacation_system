App.Views.ApprovalRequest = Backbone.View.extend({
  template: JST['templates/approval_request'],

  events: {
    // 'change select[name=teams]':          'onTeams',
  },

  initialize: function( options ) {
  },

  render: function() {
    console.log('ApprovalRequest:render');
    return this;
  },
});
