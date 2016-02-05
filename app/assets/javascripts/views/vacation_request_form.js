App.Views.VacationRequestForm = Backbone.View.extend({
  el: '.new-vacation-request-form',
  template: JST['templates/vacation_request_form'],

  events: {
    'click  button[name=clear]':    'onClear',
    'change input[name=from]':      'onFromChange',
    'click  button[name=request]':  'onRequest',
    'change input[name=to]':        'onToChange',
    'change select[name=vacation-type]': 'onTypeChange'
  },

  initialize: function(options) {
    this.holidays = options.holidays;
    this.vacationRequests = options.vacationRequests;
    this.model = new App.Models.VacationRequest();
    this.model.urlRoot = 'vacation_requests';
    this.vacationType = null;

    this.listenTo(this.model, 'sync', this.onSuccess);
    this.listenTo(this.model, 'error', this.onError);
    this.listenTo(this.model, 'invalid', this.onInvalid);
  },

  render: function() {
    this.$el.html(this.template({
      'types': _.values(App.Vacation.types)
    }));

    App.Helpers.assignDatePicker($('.input-daterange'));
    this.$('input:radio[value='+this.model.get('kind')+']').trigger('click');

    this.$requestButton = this.$('button[name=request]');
    this.disableSubmitButton();

    this.statistics = new App.Views.VacationsMiniStatistics({
      'vacationType': this.vacationType,
      'holidays': this.holidays,
      'vacationRequests': this.vacationRequests
    });
    this.statistics.render();

    return this;
  },

  enableSubmitButton: function() {
    this.$requestButton.prop('disabled', false);
  },

  disableSubmitButton: function() {
    this.$requestButton.prop('disabled', true);
  },

  onClear: function() {
    this.clearModel();
    this.clearForm();
  },

  onFromChange: function(event) {
    this.model.set('start_date', event.target.value);
  },

  onRequest: function() {
    this.model.save();
  },

  onToChange: function(event) {
    this.model.set('end_date', event.currentTarget.value);
  },

  onTypeChange: function(event) {
    this.vacationType = event.target.value;

    this.model.set('kind', this.vacationType);
    this.enableSubmitButton();
    this.statistics.update(this.vacationType);
  },

  onError: function(model, response, options) {
    var message = 'ERROR ' + response.status.toString();

    if (response.status === 422) {
      message = response.responseJSON.errors.join('\n');
    }

    alert(message);
  },

  onInvalid: function(model, response, options) {
    var message = _.values(model.validationError).join('\n');
    alert(message);
  },

  onSuccess: function(model, response, options) {
    // Trigger 'sync' on the collection to initiate it's view,
    // VacationRequestsList, about changes.
    this.vacationRequests.fetch();
    // Clear model to set it as a new one,
    // and initialize it with form data.
    // Otherwise, the model is initialized with response data and a next save()
    // will emit PUT request (update) instead of POST (create)
    this.clearModel();
    this.fetchFormData();
  },

  fetchFormData: function () {
    this.model.set('kind',        this.$('input:radio[name=vacation-type]:checked').val());
    this.model.set('start_date',  this.$('input[name=from]').val());
    this.model.set('end_date',    this.$('input[name=to]').val());
  },

  clearForm: function () {
    this.$('input[name=from]').val('').trigger('change').datepicker('update');
    this.$('input[name=to]').val('').trigger('change').datepicker('update');
    this.$('input:radio[value='+this.model.get('kind')+']').trigger('click');
  },

  clearModel: function () {
    this.model.clear();
    this.model.set(this.model.defaults);
  }
});
