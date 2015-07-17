App.Views.Team = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: JST['templates/team'],

  events: {
    'click .remove':  'onRemove',
    'dblclick':       'edit',
    'keypress .edit': 'updateOnEnter',
  },

  render: function() {
    var html = this.template(this.model.attributes);
    this.listenTo( this.model, 'change:name', this.updateName );
    this.$el.html(html);
    return this;
  },

  updateName: function( model, value, options) {
    this.$el.html( this.template(this.model.attributes) );
  },

  edit: function() {
    this.$el.addClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function( e ) {
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  // Close the `"editing"` mode, saving changes.
  close: function() {
    var value = this.$('input.edit').val().trim();

    if ( value ) {
      this.model.save({ name: value });
    } else {
      this.model.destroy();
    }

    this.$el.removeClass('editing');
  },

  onRemove: function() {
    this.model.destroy({
      wait: true,
      // TODO: assign something here
      success: function( model, response ) {
        console.log('OK: ' + response);
      },
      // TODO: assign something here
      error: function( model, response ) {
        console.log('FAIL: ' + response);
      }
    });

    this.remove();
  }
});
