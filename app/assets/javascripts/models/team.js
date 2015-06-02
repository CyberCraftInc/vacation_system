var app = app || {};

app.Team = Backbone.Model.extend({
  defaults: {
    'title': '',
    'completed': false,
  },
  // Toggle the `completed` state of this todo item.
  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});
