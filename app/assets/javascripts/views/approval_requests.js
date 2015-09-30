App.Views.ApprovalRequests = Backbone.View.extend({
  el: '.pending-requests .panel-body',
  template: JST['templates/vacation_requests_table'],

  operationsEvents: function() {
    return {
      'click button[name=accept]': this.onAccept,
      'click button[name=decline]': this.onDecline
    };
  },

  initialize: function(options) {
    this.options = options;
    this.requests = new App.Collections.ApprovalRequests();
    this.listenTo(this.requests, 'sync', this.render);

    this.onAccept   = _.bind(this.onAccept, this);
    this.onDecline  = _.bind(this.onDecline, this);

    // TODO: extract into router
    this.requests.fetch();
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
          field: 'kind',
          title: 'Type',
          align: 'center',
          valign: 'middle',
          sortable: true
      }, {
          field: 'first_name',
          title: 'User',
          align: 'center',
          valign: 'middle',
          formatter: this.fullNameFormatter,
          sortable: true
      }, {
          field: 'operations',
          title: 'Operations',
          align: 'center',
          valign: 'middle',
          width: '20%',
          events: this.operationsEvents(),
          formatter: this.managerOperationsFormatter,
          sortable: false
      }],
    });
  },

  renderMessage: function() {
    var message = 'No pending requests.',
        html = '<p>' + message + '</p>';

    this.$el.html(html);
  },

  onAccept: function(event, value, row, index) {
    var that = this;

    $.get('approval_requests/'+row.id.toString()+'/accept')
      .done(function() {
        that.$table.bootstrapTable('remove', {field:'id', values: [row.id]});
        // TODO: implement notification, if needed
      })
      .fail(function(response) {
        // TODO: implement notification
      });
  },

  onDecline: function(event, value, row, index) {
    var that = this;

    $.get('approval_requests/'+row.id.toString()+'/decline')
      .done(function() {
        that.$table.bootstrapTable('remove', {field:'id', values: [row.id]});
        // TODO: implement notification, if needed
      })
      .fail(function(response) {
        // TODO: implement notification
      });
  },

  fullNameFormatter: function(value, row, index) {
    var result = row.first_name;

    if (!_.isEmpty(row.last_name)) {
      result+=' '+row.last_name;
    }

    return result;
  },

  managerOperationsFormatter: function() {
    return JST['templates/approval_request_manager_operations']();
  }
});
