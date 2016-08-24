App.Views.NotificationForm = App.Views.BootstrapModal.extend({
  template: JST['templates/forms/notification/notification_form'],

  events: {
    'click button[name=close]': 'onClose',
    'click button[name=save]':  'onSave',
    'change input[name=teams]': 'onTeamToggle',
  },

  prepareData: function() {
    this.content = this.template();
    this.buttons = '';
    this.buttons += JST['templates/forms/user/buttons/close']();
    this.buttons += JST['templates/forms/user/buttons/save']();

    this.model = this.options.notification;

    this.model.isChanged = false;

    this.collection = this.options.collection;
    this.exportData = {teams:[]};
    this.teams_collection = this.options.teams_collection;

  },

  addListeners: function() {
    this.listenTo(this.model, 'change', this.onChange);
    this.listenTo(this.model, 'sync', this.onSuccess);
  },

  onClose: function(event) {
    this.hide();
  },

  hide: function() {
    this.$el.modal('hide');
  },

  onSave: function() {
    var isValid = false;
    this.getFormValues();
    isValid = this.model.isValid(true);

    if (isValid && this.model.isChanged) {
      this.model.save();
      this.hide();
    } else if (isValid && !this.model.isChanged) {
      this.hide();
    }
  },

  onTeamToggle: function(event) {

    var teamIDs = [],
        toBeAdded = false;

    this.$('input[name=teams]').each(function(index, input) {

      toBeAdded = $(input).prop('checked');
      if (toBeAdded) {
        teamIDs.push(parseInt($(input).prop('value')));
      }
    });

    this.exportData.teams = teamIDs;
  },

  getFormValues: function() {
    var self = this;
    _.each(this.$('input'), function(input) {
      if (input.name == 'teams') {
        this.model.set(input.name, self.exportData.teams);
      } else {
        this.model.set(input.name, input.value.trim());
      }
    }, this);
  },

  onChange: function(model, options) {
    this.model.isChanged = true;
  },

  onSuccess: function(model, response, options) {
    // Trigger App.Views.UsersList rendering
    this.collection.fetch();
    this.teams_collection.fetch();
    // Clear model to set it as a new one,
    // and initialize it with form data.
    // Otherwise, the model is initialized with response data and a next save()
    // will emit PUT request (update) instead of POST (create)
    this.clearModel();
    this.hide();
  },

  clearModel: function () {
    this.model.clear({silent:true});
  }
});
