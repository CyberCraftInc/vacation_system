App.Views.VacationRequestDetails = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_request_details'],

  events: {
    'click button.cancel':          'onCancel',
    'click button.finish':          'onFinish',
    'click button.accept':          'onAccept',
    'change input[name=end-date]':  'onEndDate',
  },

  initialize: function( options ) {
    this.cancelStatuses = ['requested', 'accepted'];
    this.finishStatuses = ['inprogress'];
    this.model = new App.Models.VacationRequest({id:options.modelID});

    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model, 'all',  this.logger); // TODO: remove later

    this.model.fetch();
    this.endDate = null;
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.updateCancelButtonState();
    this.updateFinishButtonState();
    return this;
  },

  onCancel: function( e ) {
    this.model.save({status: 'cancelled'},{patch: true});
  },

  onFinish: function( e ) {
    this.$('.dialog-finish').show();
  },

  onAccept: function( e ) {
    var attributes = {
      status: 'used',
      end:    this.endDate.getTime()
    };

    this.model.save(attributes,{patch: true});
    this.$('.dialog-finish').hide();
    // this.updateFinishButtonState();
  },

  onEndDate: function( e ) {
    var value = e.target.value;
    if (value) {
      this.endDate = new Date(value);
      this.$('button.accept').removeAttr('disabled');
    } else {
      this.$('button.accept').attr('disabled',true);
    }
  },

  updateCancelButtonState: function() {
    var button = this.$('button.cancel');
    if (!this.isEnabled(this.cancelStatuses)) {
      button.attr('disabled','disabled');
    }
  },

  updateFinishButtonState: function() {
    var button = this.$('button.finish');
    if (!this.isEnabled(this.finishStatuses)) {
      button.attr('disabled','disabled');
    }
  },


  isEnabled: function( allowedStatuses ) {
    var vacationStatus = this.model.get('status');
    var result = _.include(allowedStatuses, vacationStatus);
    return result;
  },

  logger: function( e ) {
    console.log(e);
  }
});
