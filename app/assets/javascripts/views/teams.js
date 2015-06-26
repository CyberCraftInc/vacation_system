App.Views.Teams = Backbone.View.extend({
  el: 'section',
  template: JST['templates/teams'],

  events: {
    'click .create':  'onCreate',
  },

  initialize: function() {
    this.collection = new App.Collections.Teams();
    this.$el.html( this.template() );
    // The following is for FF, as it ignores `autofocus`
    this.$('#team-name').focus();
    this.collection.fetch({reset: true});
    this.listenTo( this.collection, 'add',    this.addTeam );
    this.listenTo( this.collection, 'reset',  this.render );
  },

  addTeam: function( model, collection, options ) {
    var newItem = new App.Views.Team({'model': model});
    this.$('ul.teams-list').append( newItem.render().$el );
  },

  render: function() {
    var $list = this.$('ul.teams-list').empty();

    this.collection.each(function(model) {
      var item = new App.Views.Team({'model': model});
      $list.append(item.render().$el);
    }, this);

    return this;
  },

  onCreate: function() {
    var $name = this.$('#team-name');

    if ($name.val()) {
      this.collection.create({ 'name': $name.val() });

      $name.val('');
    }
  },
});
