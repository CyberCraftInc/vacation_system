App.Views.VacationRequestForm = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_request_form'],

  events: {
    'click  .ok':                         'onCreate',
    'click  .cancel':                     'onCancel',
    'change select[name=vacation_type]':  'onTypeChange',
    'change input[name=start]':           'onStartDate',
    'change input[name=end]':             'onEndDate',
  },

  initialize: function() {
    this.$el.html(this.template());
    // Prepare handy access for the controls
    this.$available_days  = this.$('#available_days');
    this.$vacation_type   = this.$('select[name=vacation_type]');

    this.available_vacations  = new App.Collections.AvailableVacations();
    this.vacation_requests    = new App.Collections.VacationRequests();
    this.listenTo(this.available_vacations,  'reset',  this.render);

    this.available_vacations.fetch({reset: true});
    this.vacation_requests.fetch({reset: true});
    // Set date picker variables
    this.startDate  = new Date();
    this.endDate    = this.startDate;
    this.duration = 0;
  },

  render: function() {
    this.updateAvailableDays();
    this.updateOkButtonState();

    // TODO: Disable option as described below when there is no days available
    // http://www.mkyong.com/jquery/how-to-set-a-dropdown-box-value-in-jquery/

    return this;
  },

  calculateDuration: function( begin, end ) {
    d1 = Date.UTC(begin.getFullYear(), begin.getMonth(), begin.getDate());
    d2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
    var diff = d2 - d1;
    // TODO: Swap values of controls if `startDate` is bigger than `endDate`
    if (diff < 0) {
      diff = -diff;
      // this.$('input[name=start]').val(this.endDate.format);
      // this.$('input[name=end]').val(this.startDate);
    }
    this.duration = (diff)/(1000*3600*24) + 1;
    this.updateAvailableDays();
  },

  onStartDate: function( e ) {
    this.startDate = new Date(e.target.value);
    this.calculateDuration(this.startDate, this.endDate);
  },

  onEndDate: function( e ) {
    this.endDate = new Date(e.target.value);
    this.calculateDuration(this.startDate, this.endDate);
  },

  onTypeChange: function( e ) {
    this.updateAvailableDays();
    this.updateOkButtonState();
  },

  onCreate: function() {
    this.vacation_requests.create({
      'start':    this.startDate.getTime(),
      'duration': this.duration,
      'kind':     this.$vacation_type.val(),
    });
  },

  onCancel: function( op ) {
    // TODO: remove this function; or think about how to interpret this event
  },

  updateOkButtonState: function() {
    var isDisabled = true;

    isWrongVacationType = (this.$vacation_type.val() == '-1');
    isWrongDuration     = ((this.getAvailableDays() - this.duration) < 0);

    isDisabled = isWrongVacationType || isWrongDuration;

    this.$('button.ok').prop("disabled", isDisabled);
  },

  updateAvailableDays: function() {
    if ( this.$vacation_type.val() == '-1' ) {
      this.$available_days.text('Please, select vacation type above...');
    } else { // Update with current duration
      var availableDays = this.getAvailableDays();
      var newValue      = availableDays - this.duration;
      this.$available_days.text(newValue);
    }
  },

  getAvailableDays: function() {
    var result = 0;
    var value   = this.$vacation_type.val();
    if ( value !== '-1' ) {
      result  = this.available_vacations
                    .findWhere({kind:value})
                    .get('available_days');
    }
    return result;
  },
});
