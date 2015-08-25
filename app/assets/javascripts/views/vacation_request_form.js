App.Views.VacationRequestForm = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_request_form'],

  events: {
    'click  button[name=clear]':    'onClear',
    'change input[name=from]':      'onFromChange',
    'click  button[name=request]':  'onRequest',
    'change input[name=to]':        'onToChange',
    'change input:radio[name=vacation-type]': 'onTypeChange',

  },

  initialize: function(options) {
    var that = this;

    this.holidays = options.holidays;
    this.availableVacations = options.availableVacations;
    this.vacationRequest = new App.Models.VacationRequest();

    this.listenTo(this.holidays, 'sync',  this.render);

    // Ensure that all requests are complete
    this.availableVacations.fetch().then(function() {
      that.holidays.fetch();
    });
  },

  render: function() {
    this.$el.html(this.template({'availableVacations':this.availableVacations.models}));
    App.Helpers.assignDatePicker($('.input-daterange'));
    this.$('input[value='+this.vacationRequest.get('kind')+']').trigger('click');

    return this;
  },

  onClear: function(event) {
    this.$('input[name=from]').val('').trigger('change').datepicker('update');
    this.$('input[name=to]').val('').trigger('change').datepicker('update');
  },

  onFromChange: function(event) {
    this.vacationRequest.set('start', event.currentTarget.value);
    this.calculateDuration();
  },

  onRequest: function() {
    this.vacationRequest.save();
  },

  onToChange: function(event) {
    this.vacationRequest.set('end', event.currentTarget.value);
    this.calculateDuration();
  },

  onTypeChange: function(event) {
    this.vacationRequest.set('kind', event.currentTarget.value);
    this.calculateDuration();
  },

  calculateDuration: function() {
    this.vacationRequest.calculateDuration(this.holidays);
    this.updateAvailableDays();
    this.updateRequestButtonState();
  },

  getAvailableDays: function() {
    return this.availableVacations
                  .findWhere({'kind':this.vacationRequest.get('kind')})
                  .get('available_days');
  },

  updateAvailableDays: function() {
    var $badge;

    this.availableVacations.each(function(model) {
      $badge = this.$('.badge.'+model.attributes.kind);
      $badge.text(this.vacationRequest.get('duration')+'|'+model.attributes.available_days);
    }, this);
  },

  updateRequestButtonState: function() {
    var isWrongDuration = true,
        $button = this.$('button[name=request]');

    isWrongDuration = ((this.getAvailableDays() - this.vacationRequest.get('duration')) < 0);

    if (isWrongDuration) {
      $button.removeClass('btn-default');
      $button.addClass('btn-danger');
    } else {
      $button.removeClass('btn-danger');
      $button.addClass('btn-default');
    }
  },
});
