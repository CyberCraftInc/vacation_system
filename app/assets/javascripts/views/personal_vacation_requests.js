App.Views.PersonalVacationRequests = Backbone.View.extend({
  el: '.personal-requests .panel-body',
  template: JST['templates/vacation_requests_table'],

  operationsEvents: function() {
    return {
      'click button[name=cancel]': this.onCancel
    };
  },

  onCancel: function(event, value, row, index) {
    var that = this;

    $.get('vacation_requests/'+row.id.toString()+'/cancel')
      .done(function() {
        that.$table.bootstrapTable('remove', {field:'id', values: [row.id]});
        // TODO: implement notification, if needed
      })
      .fail(function(response) {
        // TODO: implement notification
      });
  },

  initialize: function(options) {
    this.options = options;
    this.requests = new App.Collections.PersonalVacationRequests();

    this.listenTo(this.requests, 'sync', this.render);

    this.requests.fetch();
    this.onCancel = _.bind(this.onCancel, this);
    this.durationFormatter = _.bind(this.durationFormatter, this);
  },

  render: function() {
    this.$el.html(this.template());

    if (this.requests.isEmpty()) {
      this.renderMessage();
    } else {
      this.renderRequests();
    }
    return this;
  },

  renderMessage: function() {
    var message = 'No pending requests.',
        html = '<p>' + message + '</p>';

    this.$el.html(html);
  },

  renderRequests: function() {
    this.$table = $(this.$el.selector + ' table');

    this.$table.bootstrapTable({
      data: this.requests.toJSON(),
      columns: [{
          field: 'start_date',
          title: 'Start date',
          valign: 'middle',
          sortable: true
      }, {
          field: 'end_date',
          title: 'End date',
          valign: 'middle',
          sortable: true
      }, {
          title: 'Duration',
          align: 'center',
          valign: 'middle',
          formatter: this.durationFormatter,
          sortable: true
      }, {
          field: 'kind',
          title: 'Type',
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

  durationFormatter: function(value, row, index) {
    var duration,
        vacation = new App.Models.VacationRequest();

    vacation.set('kind', row.kind);
    vacation.set('start_date', row.start_date);
    vacation.set('end_date', row.end_date);

    duration = vacation.calculateDuration(this.options.holidays);

    return duration;
  },

  ownerOperationsFormatter: function(value, row, index) {
    return JST['templates/approval_request_owner_operations']();
  }
});
