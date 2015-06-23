App.Views.VacationRequest = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_request'],

  initialize: function() {
    this.$el.html( this.template() );
    this.available_vacations  = new App.Collections.AvailableVacations();
    this.vacation_requests    = new App.Collections.VacationRequests();
    this.listenTo( this.vacation_requests,    'add',    this.createRequest );
    this.listenTo( this.available_vacations,  'reset',  this.render );
    this.listenTo( this.vacation_requests,    'all',  this.logg );
    // this.listenTo( this.collection, 'sync', this.render );
    this.available_vacations.fetch({reset: true});
    this.vacation_requests.fetch({reset: true});
  },

  createRequest: function( model, collection, options ) {
    console.log('createRequest');
    // var newItem = new App.Views.VacationRequest({'model': model});
    // TODO: Recalculate available days
  },

  render: function() {
    console.log(JSON.stringify(this.available_vacations));
    console.log(JSON.stringify(this.vacation_requests));
    var $label  = this.$('#available_days');
    var $select = this.$('select[name=vacation_type]');

    $label.text('Please, select vacation type above...');
    console.log($select.val());
    // $select.val('planned').change();
    // console.log($select.val());

    return this;
  },

  events: {
    'click  .ok':         'onCreate',
    'click  .cancel':     'onCancel',
    'change select[name=vacation_type]':     'onTypeChange',
  },

  onTypeChange: function(e) {
    var value = e.target.value;
    console.log('onTypeChange');
    console.log(value);
    this.$('#available_days').text('Number of <' + value + '> days!');
    // TODO: Disable option as described below when there is no days available
    // http://www.mkyong.com/jquery/how-to-set-a-dropdown-box-value-in-jquery/
  },

  onCreate: function() {
    console.log('onCreate');
  },

  onCancel: function( op ) {
    console.log('onDestroy' + op);
  },

  logg: function( e, p ) {
    // console.log(e + ' with ' + p);
    console.log(e);
  },
});
