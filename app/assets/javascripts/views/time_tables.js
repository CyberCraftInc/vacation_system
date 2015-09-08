App.Views.TimeTables = Backbone.View.extend({
  el: '.time-table-content',
  template: JST['templates/time_tables'],

  events: {
    'change input[name=from]':  'onFrom',
    'change input[name=to]':    'onTo',
    'change select[name=view-type]':    'onViewType'
  },

  initialize: function(options) {
    this.attributes = {};
    this.holidays = options.holidays;
    this.timeTableDateRange = {};

    this.teamIDs = options.team_ids || [1];
    this.timeTableViews = [];

    this.setDefaultViewType();
    this.setDefaultDateRange();

    this.render();
  },

  render: function() {
    this.renderTemplate(this.attributes);
    this.renderTimeTables();

    return this;
  },

  update: function(teamIDs) {
    delete this.members;
    this.teamIDs = teamIDs;
    // this.renderTemplate();
    this.renderTimeTables();
    return this;
  },

  renderTemplate: function() {
    this.$el.html(this.template(this.attributes));
  },

  // *************************************************************************
  renderTimeTables: function() {
    var $timeTableContainer = null;
    var selector = '';
    var timeTable = this.getTimeTableType();

    this.$('.time-tables').empty();
    this.destroyTimeTables();

    this.teamIDs.forEach(function(id) {
      selector = 'team'+id;
      $timeTableContainer = $('<div>').appendTo('.time-tables')
        .attr('id', selector);
      this.timeTableViews.push( new timeTable({
                                  'team_id': id,
                                  'el': '#'+selector,
                                  'from': this.timeTableDateRange.begin,
                                  'to': this.timeTableDateRange.end,
                                  'holidays': this.holidays
                                }));
    }, this);
  },

  updateTimeTables: function() {
    this.timeTableViews.forEach(function(view) {
      view.update(this.timeTableDateRange);
    }, this);
  },

  destroyTimeTables: function() {
    this.timeTableViews.forEach(function(view) {
      view.remove();
    });
  },

  getTimeTableType: function() {
    return this.viewType === 'day' ? App.Views.TimeTableByDay : App.Views.TimeTableByWeek;
  },

  // *************************************************************************
  onFrom: function(e) {
    this.timeTableDateRange.begin = moment(e.target.value);
    this.updateTimeTables();
  },

  onTo: function(e) {
    this.timeTableDateRange.end   = moment(e.target.value);
    this.updateTimeTables();
  },

  onViewType: function(e) {
    this.viewType = e.target.value;
    this.attributes.viewType = this.viewType;

    this.update(this.teamIDs);
  },
  // *************************************************************************

  setDefaultDateRange: function() {
    var now = moment();
    this.timeTableDateRange.begin = moment(now.format('YYYY-MM-DD'));
    this.timeTableDateRange.end   = moment().add(3, 'months');
    this.attributes.from  = this.timeTableDateRange.begin.format('YYYY-MM-DD');
    this.attributes.to    = this.timeTableDateRange.end.format('YYYY-MM-DD');
  },

  setDefaultViewType: function() {
    this.viewType = 'day';
    this.attributes.viewType = this.viewType;
  }
});
