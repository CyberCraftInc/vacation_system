App.Views.Team = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: JST['templates/team'],

  events: function() {
    var role = App.currentUserRoles.highestPrivilege(),
        result = {};

    switch (role) {
      case 'manager':
        result = {
          'click .remove': 'onRemove',
          'dblclick .view': 'edit',
          'keypress .edit': 'updateOnEnter'
        };
        break;

      default:
        result = {};
    }

    return result;
  },

  initialize: function(options) {
    this.model = options.model;
    this.attributes = {
      role: App.currentUserRoles.highestPrivilege()
    };
  },

  render: function() {
    var attributes = this.model.attributes;

    attributes.role = this.attributes.role;
    this.listenTo(this.model, 'change:name', this.updateName);
    this.$el.html(this.template(attributes));

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
      success: function( model, response ) {
      // TODO: inform user about success if needed
      },
      error: function( model, response ) {
      // TODO: inform user about fail if needed
      }
    });

    this.remove();
  }
});
