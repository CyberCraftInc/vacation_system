var app = app || {};

app.TeamListView = Backbone.View.extend({
  el: 'body',
  template: JST['templates/teams'],

  initialize: function() {
    this.listenTo(this.collection, 'sync', this.render);
    this.$el.append( this.template() );
    // console.log('init, el: ' + this.el);
  },

  render: function() {
    // console.log('render, el: ' + this.el);
    var $list = this.$('ul.teams-list').empty();

    this.collection.each(function(model) {
      var item = new app.TeamListItemView({'model': model});
      $list.append(item.render().$el);
    }, this);

    return this;
  },

  events: {
    'click .create':  'onCreate',
    'destroy':        'onDestroy'
  },

  onCreate: function() {
    var $name = this.$('#team-name');
    console.log('ON_CREATE: ' + $name.val());

    if ($name.val()) {
      this.collection.create({ 'name': $name.val() });

      $name.val('');
    }
  },

  onDestroy: function( op ) {
    console.log('onDestroy' + op);
  }
});
