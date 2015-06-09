var app = app || {};

app.TeamListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'team',
  template: JST['templates/team'],

  initialize: function() {
    console.log('init, el: ' + this.el);
  },

  render: function() {
    console.log('render, el: ' + this.el);
    var html = this.template(this.model.attributes);
    this.$el.html(html);
    return this;
  },

  events: {
    'click .remove':  'onRemove',
    'dblclick':       'edit',
    'keypress .edit': 'updateOnEnter',
  },

  edit: function() {
    console.log('edit');
    this.$el.addClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function( e ) {
    console.log('Inside TodoView.updateOnEnter' + e);
    if ( e.which === ENTER_KEY ) {
      this.close();
    }
  },

  // Close the `"editing"` mode, saving changes to the todo.
  close: function() {
    // var value = this.$input.val().trim();
    console.log(this.$('input.edit'));
    var value = this.$('input.edit').val().trim();
    console.log('GOT: ' + value);

    if ( value ) {
      this.model.save({ name: value });
    } else {
      // this.clear();
      this.model.destroy();
    }

    this.$el.removeClass('editing');
  },

  onRemove: function() {
    console.log('remove, el: ' + this.el);
    this.model.destroy({
      wait: true,
      success: function( model, response ) {
        console.log('OK: ' + response);
      },
      error: function( model, response ) {
        console.log('FAIL: ' + response);
      }
    });

    this.remove();
  }
});
