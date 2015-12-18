App.Views.Role = Backbone.View.extend({
  tagName: 'label',
  className: 'btn btn-default',
  template: JST['templates/role'],

  operationsEvents: function() {
    return {
      'change input[name=roles]': this.onToggle,
    };
  },

  // events: {
  //   'change input[name=roles]': 'onToggle',
  // },

  initialize: function(options) {
    this.userID = options.userID;
    this.roleName = options.roleName;
    options.events = this.operationsEvents;
  },

  render: function() {
    var html = this.template({
      'roleName': this.roleName,
      'userID': this.userID,
    });

    this.$el.html(html);
    this.$input = this.$('input');
    return this;
  },

  activate: function() {
    this.$el.addClass('active');
  },

  check: function() {
    this.$input.attr('checked', 'checked');
  },

  onDestroy: function(model) {
    console.log('onDestroy');
    this.roles.remove(model);
    this.$currentRoleButton.parent().removeClass('active');
  },

  onError: function(model, response, options) {
    var message = _.chain(response.responseJSON.errors)
      .map(function(error) {
        return error;
      })
      .join('\n')
      .value();

    alert(message);
  },

  onSuccess: function(model) {
    console.log('onSuccess');
    this.roles.add(model);
    this.$currentRoleButton.parent().addClass('active');
  },

  onToggle: function(event) {
    console.log('onToggle');
    // var $input = $(event.target),
    //     toBeAdded = $input.prop('checked'),
    //     userID = $input.data('userId');
    //
    // console.log(userId);
    // if (toBeAdded) {
    //   role.set('role', $input.val());
    //   role.set('user_id', userID);
    //   role.set('team_id', this.team.get('id'));
    //
    //
    //   role.save();
    //   this.$input.parent().removeClass('active');
    //
    // } else {
    //   role = this.roles.findWhere({
    //     'role': $input.val(),
    //     'user_id': userID,
    //     'team_id': this.team.get('id'),
    //   });
    //
    //   this.listenToOnce(role, 'destroy', this.onRoleDestroy);
    //   this.$currentRoleButton.parent().addClass('active');
    //   role.destroy();
    // }
  }
});
