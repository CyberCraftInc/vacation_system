App.Views.VacationRequestsList = Backbone.View.extend({
  el: 'section',
  template: JST['templates/vacation_requests_list'],

  events: {
    'change select[name=vacation-status]':  'onStatusChange',
    // 'change input[name=from]':           'onFromDate',
    // 'change input[name=to]':             'onToDate',
  },

  initialize: function() {
    this.$el.html(this.template());
    this.collection = new App.Collections.VacationRequests();
    // Prepare handy access for the controls
    this.$table   = this.$('table.vacation-requests');
    this.$select  = this.$('select[name=vacation-status]');

    this.listenTo(this.collection,  'sync',  this.render);
    this.listenTo(this.collection,  'all',  this.logger);

    this.collection.fetch();
    this.statusFilter = null;
  },

  render: function() {
    this.$table.empty();
    this.collection.each(function(model) {
      var isVisible = _.include(this.statusFilter, model.get('status'));
      if (isVisible) {
        var item = new App.Views.VacationRequest({'model': model});
        this.$table.append(item.render().$el);
      }
    }, this);

    return this;
  },

  onStatusChange: function( e ) {
    this.statusFilter = this.$select.val();
    this.render();
    // console.log(this.statusFilter);
  },

  logger: function( e, p ) {
    console.log(e);
  },
});
