App.Views.VacationRequestDetails = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_request_details'],

  events: {
    'click button.cancel':  'onCancel',
    // 'click button.finish':  'onFinish',
  },

  initialize: function( options ) {
    this.cancelStatuses = ['requested', 'accepted'];
    // this.statuses = ['declined', 'cancelled', 'inprogress', 'used'];
    this.model = new App.Models.VacationRequest({id:options.modelID});

    this.listenTo(this.model,  'sync',  this.render);
    this.listenTo(this.model,  'all',   this.logger); // TODO: remove later

    this.model.fetch();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.updateCancelButtonState();
    return this;
  },

  updateCancelButtonState: function() {
    var button = this.$('button.cancel');
    var vacationStatus = this.model.get('status');
    var isEnabled = _.include(this.cancelStatuses, vacationStatus);
    if (!isEnabled) {
      button.attr('disabled','disabled');
    }
  },

  logger: function( e ) {
    console.log(e);
  }
});
