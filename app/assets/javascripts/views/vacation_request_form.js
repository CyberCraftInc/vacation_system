App.Views.VacationRequestForm = Backbone.View.extend({
  el: '.new-vacation-request-form',
  template: JST['templates/vacation_request_form'],

  events: {
    'click  button[name=clear]':    'onClear',
    'change input[name=from]':      'onFromChange',
    'click  button[name=request]':  'onRequest',
    'change input[name=to]':        'onToChange',
    'change input:radio[name=vacation-type]': 'onTypeChange'
  },

  initialize: function(options) {
    this.holidays = options.holidays;
    this.vacationRequests = options.vacationRequests;
    this.availableVacations = options.availableVacations;
    this.model = new App.Models.VacationRequest();

    this.listenTo(this.model, 'sync', this.onSuccess);
    this.listenTo(this.model, 'error', this.onError);
  },

  render: function() {
    this.$el.html(this.template({'availableVacations':this.availableVacations.models}));
    App.Helpers.assignDatePicker($('.input-daterange'));
    this.$('input:radio[value='+this.model.get('kind')+']').trigger('click');

    return this;
  },

  onClear: function(event) {
    this.$('input[name=from]').val('').trigger('change').datepicker('update');
    this.$('input[name=to]').val('').trigger('change').datepicker('update');
  },

  onFromChange: function(event) {
    this.model.set('start_date', event.currentTarget.value);
    this.updateFormState();
  },

  onRequest: function() {
    this.model.set('actual_end_date',this.model.get('planned_end_date'));
    this.model.save();
  },

  onToChange: function(event) {
    this.model.set('planned_end_date', event.currentTarget.value);
    this.updateFormState();
  },

  onTypeChange: function(event) {
    this.model.set('kind', event.currentTarget.value);
    this.updateFormState();
  },

  updateAvailableDaysInBadges: function() {
    var $badge;

    this.availableVacations.each(function(model) {
      $badge = this.$('.badge.'+model.attributes.kind);
      $badge.text(this.model.calculateDuration(this.holidays)+'|'+model.attributes.available_days);
    }, this);
  },

  updateFormState: function() {
    this.updateAvailableDaysInBadges();
    this.updateRequestButtonState();
  },

  updateRequestButtonState: function() {
    var isWrongDuration = true,
        $button = this.$('button[name=request]');

    isWrongDuration = ((this.availableVacations.availableDaysOfType(this.model.get('kind')) - this.model.calculateDuration(this.holidays)) < 0);

    if (isWrongDuration) {
      $button.removeClass('btn-default');
      $button.addClass('btn-danger');
    } else {
      $button.removeClass('btn-danger');
      $button.addClass('btn-default');
    }
  },

  onError: function(model, response, options) {
    // TODO: show error messages to user
    // console.log(response.responseJSON.errors.base);
  },

  onSuccess: function(model, response, options) {
    // Trigger 'sync' on the collection to inform it's view,
    // VacationRequestsList, about changes.
    this.vacationRequests.fetch();
  }
});
