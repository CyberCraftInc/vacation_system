App.Views.Teams = Backbone.View.extend({
  el: 'section',
  template: JST['templates/teams'],

  initialize: function() {
    this.collection = new App.Collections.Teams();
    this.$el.html( this.template() );
    // The following is for FF, as it ignores `autofocus`
    this.$('#team-name').focus();
    // console.log('init, el: ' + this.el);
    this.collection.fetch({reset: true});
    this.listenTo( this.collection, 'add',    this.addTeam );
    this.listenTo( this.collection, 'reset',  this.render );
    this.listenTo( this.collection, 'all',  this.logg );
    // this.listenTo( this.collection, 'sync', this.render );
  },

  addTeam: function( model, collection, options ) {
    console.log('addTeam');
    var newItem = new App.Views.Team({'model': model});
    this.$('ul.teams-list').append( newItem.render().$el );
  },

  render: function() {
    // console.log('render, el: ' + this.el);
    var $list = this.$('ul.teams-list').empty();

    this.collection.each(function(model) {
      var item = new App.Views.Team({'model': model});
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
  },

  logg: function( e, p ) {
    // console.log(e + ' with ' + p);
    console.log(e);
  },
});
