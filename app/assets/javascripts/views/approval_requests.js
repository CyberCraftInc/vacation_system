App.Views.ApprovalRequests = Backbone.View.extend({
  template: JST['templates/approval_requests'],

  events: {
    // 'change select[name=teams]':          'onTeams',
  },

  initialize: function( options ) {
    this.options = options;
    this.el = options.el;
    this.requests = new App.Collections.ApprovalRequests(options);
    this.listenTo(this.requests,  'sync',  this.render);

    this.requests.fetch();
  },

  render: function() {
    if (this.requests.isEmpty()) {
      this.renderMessage();
    } else {
      this.renderRequests();
    }
    return this;
  },

  renderRequests: function() {
    this.$el.html(this.template());

    $(this.el+' table').bootstrapTable({
      data: this.requests.toJSON(),
      columns: this.options.columns
    });
  },

  renderMessage: function() {
    console.log('Empty!');
    var message = 'No pending requests.';
    var html = '<p>' + message + '</p>';

    this.$el.html(html);
  }
});
