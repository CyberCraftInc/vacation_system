App.Views.Teams = Backbone.View.extend({
  el: 'section',
  template: JST['templates/teams'],

  events: {
    'click button[name=add]':  'onAddTeam',
  },

  initialize: function(options) {
    this.$el.html(this.template());
    this.collection = options.collection;
    this.listenTo(this.collection, 'add',  this.addTeam);
    this.listenTo(this.collection, 'sync', this.render);
  },

  addTeam: function(model, collection, options) {
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

  onAddTeam: function(event) {
    event.preventDefault();
    var input   = this.$('input[name=team-name]'),
        model   = new App.Models.Team(),
        value   = input.val(),
        errors  = model.preValidate('name', value);

    if ( errors ) {
      console.log(errors);
    } else {
      this.collection.create({'name': value});

      console.log('Valid team name is added to the collection.');
      input.val('');
    }
  },
});
