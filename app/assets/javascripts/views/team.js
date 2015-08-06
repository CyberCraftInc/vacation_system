App.Views.Team = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: JST['templates/team'],

  events: {
  },

  initialize: function(options) {
    this.model = options.model;
    this.attributes = {
      role: App.currentUserRoles.highestPrivilege()
    };
    this.addAuthorizedEvents();
  },

  render: function() {
    var attributes = this.model.attributes;

    attributes.role = this.attributes.role;
    this.listenTo(this.model, 'change:name', this.updateName);
    this.$el.html(this.template(attributes));

    return this;
  },

  addAuthorizedEvents: function() {
    var role = this.attributes.role;
    switch (role) {
      case 'manager':
        this.addEventsForManager();
        break;
    }

    return this;
  },

  addEventsForManager: function() {
    this.events['click .remove']  = 'onRemove';
    this.events['dblclick .view'] = 'edit';
    this.events['keypress .edit'] = 'updateOnEnter';
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
