App.Views.Team = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: JST['templates/team'],

  events: {
    'click .remove':  'onRemove',
    'dblclick .view': 'edit',
    'keypress .edit': 'updateOnEnter',
  },

  render: function() {
    var html = this.template(this.model.attributes);
    this.listenTo(this.model, 'change:name', this.updateName);
    this.$el.html(html);
    return this;
  },

  updateName: function(model, value, options) {
    this.$el.html(this.template(this.model.attributes));
  },

  edit: function() {
    this.$el.addClass('editing');
  },

  // If you hit `enter`, we're through editing the item.
  updateOnEnter: function(event) {
    if (event.which === ENTER_KEY) {
      this.close();
    }
  },

  // Close the `"editing"` mode, saving changes.
  close: function() {
    var input = this.$('input.edit');
    var value = input.val().trim();
    var errors = this.model.preValidate('name', value);

    if (errors) {
      input.val(this.model.get('name'));
    } else if (value !== this.model.get('name')) {
      this.model.save('name', value);
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
