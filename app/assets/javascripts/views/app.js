var app = app || {};

app.AppView = Backbone.View.extend({
  el: 'body',
  initialize: function() {
    this.collection = app.Teams;
    this.collection.fetch({reset: true});
    // this.render();

    this.listenTo( this.collection, 'add',    this.renderTeam );
    this.listenTo( this.collection, 'reset',  this.render );
    this.listenTo( this.collection, 'all',  this.logg );
  },

  logg: function( e, p ) {
    // console.log(e + ' with ' + p);
    console.log(e);
  },

  render: function() {
    console.log('APP_RENDER_COLLECTION: ' + this.collection.length);

    this.view = new app.TeamListView({ collection: this.collection });
  },

  renderTeam: function( item ) {
    var teamView = new app.TeamListItemView({ model: item});
    // this.$el.append( teamView.render().el );
  }
});
