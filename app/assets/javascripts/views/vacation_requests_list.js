App.Views.VacationRequestsList = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_requests_list'],

  events: {
    'change select[name=vacation-status]':  'onStatusChange',
    'change input[name=from]':              'onDateFrom',
    'change input[name=to]':                'onDateTo',
  },

  initialize: function() {
    this.$el.html(this.template());
    this.collection = new App.Collections.VacationRequests();
    // Prepare handy access for the controls
    this.$table     = this.$('table.vacation-requests');
    this.$tableRows = this.$('table.vacation-requests tbody');
    this.$select    = this.$('select[name=vacation-status]');
    this.$from      = this.$('input[name=from]');
    this.$to        = this.$('input[name=to]');

    this.listenTo(this.collection,  'sync',  this.render);
    this.listenTo(this.collection,  'all',  this.logger);

    this.collection.fetch();
    this.statusFilter = null;
    this.dateFrom = null;
    this.dateTo   = null;
  },

  render: function() {
    var numberOfVisibleVacations = 0;
    this.$tableRows.empty();
    // Hide empty table
    this.$table.hide();

    this.collection.each(function(model) {
      if (this.isVacationVisible(model)) {
        numberOfVisibleVacations++;
        var item = new App.Views.VacationRequest({'model': model});
        this.$tableRows.append(item.render().$el);
      }
    }, this);

    if (numberOfVisibleVacations > 0) {
      this.$table.show();
    }

    return this;
  },

  onStatusChange: function( e ) {
    this.statusFilter = this.$select.val();
    this.render();
  },

  onDateFrom: function( e ) {
    this.dateFrom = this.$from.val();
    this.render();
  },

  onDateTo: function( e ) {
    this.dateTo = this.$to.val();
    console.log(this.dateTo);
    this.render();
  },

  // Convert date's string into it's miliseconds representation
  dateToMS: function( date ) {
    var dateInMS = (new Date(date)).getTime();

    var result = date ? dateInMS : 0;
    return result;
  },

  // Check if given model should be visible
  isVacationVisible: function( model ) {
    var isVisible = false;
    // Calculate date in miliseconds to compare later
    var dateFrom  = this.dateToMS(this.dateFrom);
    var dateTo    = this.dateToMS(this.dateTo);
    var modelFrom = this.dateToMS(model.get('start'));

    var hasProperStatus = _.include(this.statusFilter, model.get('status'));
    var hasProperDateRange = (modelFrom >= dateFrom) && ((modelFrom <= dateTo) || (dateTo === 0));

    isVisible = hasProperStatus && hasProperDateRange;

    return isVisible;
  },

  logger: function( e, p ) {
    console.log(e);
  },
});
