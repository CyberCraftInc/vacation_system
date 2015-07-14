App.Views.VacationRequest = Backbone.View.extend({
  tagName: 'tr',
  template: JST['templates/vacation_request'],

  initialize: function() {
    var start     = new Date(this.model.get('start'));
    var duration  = this.model.get('duration');
    var finish    = this.model.get('end');

    d1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    d2 = d1 + duration * 24 * 3600 * 1000;

    if (finish === null) {
      finish = new Date(d2);
      finish = finish.toJSON().slice(0,10);
    }
    this.attributes = {
      start:  this.model.get('start'),
      finish: finish,
      status: this.model.get('status'),
      ref:    '#/vacation_request/' + this.model.get('id').toString()
    };
  },

  render: function() {
    // var html = this.template(this.model.attributes);
    var html = this.template(this.attributes);
    this.$el.html(html);
    return this;
  },
});
