App.Views.VacationRequestsList = Backbone.View.extend({
  el: '.vacation-requests-list',
  template: JST['templates/vacation_requests_list'],

  operationsEvents: function() {
    return {
      'click button[name=cancel]':  this.onCancel,
      'click button[name=start]':   this.onStart
    };
  },

  initialize: function(options) {
    this.collection = options.vacationRequests;

    this.listenTo(this.collection, 'sync',  this.renderTable);

    this.onCancel = _.bind(this.onCancel, this);
    this.onStart  = _.bind(this.onStart, this);
  },

  render: function() {
    this.$el.html(this.template());

    this.$table = this.$('table.vacation-requests');

    this.renderTable();

    return this;
  },

  renderTable: function() {
    this.$table.bootstrapTable('destroy');
    this.$table.bootstrapTable({
      search: true,
      data: this.collection.toJSON(),
      columns: [{
          field: 'start_date',
          title: 'Start date',
          valign: 'middle',
          sortable: true
      }, {
          field: 'actual_end_date',
          title: 'End date',
          valign: 'middle',
          sortable: true
      }, {
          field: 'kind',
          title: 'Type',
          align: 'center',
          valign: 'middle',
          sortable: true
      }, {
          field: 'status',
          title: 'Status',
          align: 'center',
          valign: 'middle',
          sortable: true
      }, {
          field: 'operations',
          title: 'Operations',
          align: 'center',
          events: this.operationsEvents(),
          formatter: this.ownerOperationsFormatter,
          width: '15%',
          sortable: false
      }],
    });
  },

  onCancel: function(event, value, row, index) {
    var that = this;

    $.get('vacation_requests/'+row.id.toString()+'/cancel')
      .done(function() {
        // TODO: implement notification, if needed
        // Trigger table update
        that.collection.fetch();
      })
      .fail(function(response) {
        // TODO: implement notification
        console.error('FAIL');
      });
  },

  onStart: function(event, value, row, index) {
    var that = this;

    $.get('vacation_requests/'+row.id.toString()+'/start')
      .done(function() {
        // TODO: implement notification, if needed
        // Trigger table update
        console.log('DONE');
        that.collection.fetch();
      })
      .fail(function(response) {
        // TODO: implement notification
        console.error('FAIL');
        console.error(response.responseText);
      });
  },

  ownerOperationsFormatter: function(value, row, index) {
    var buttons = [],
        canBeCancelled = false,
        canBeSetToInprogress = false;

    canBeCancelled = (row.status !== App.Vacation.statuses.cancelled && row.status !== App.Vacation.statuses.inprogress);
    canBeSetToInprogress = (row.status === App.Vacation.statuses.accepted);

    if (canBeSetToInprogress) {
      buttons.push(JST['templates/vacation_operations/inprogress']());
    }

    if (canBeCancelled) {
      buttons.push(JST['templates/vacation_operations/cancelled']());
    }

    return buttons.join('&nbsp;');
  }
});
