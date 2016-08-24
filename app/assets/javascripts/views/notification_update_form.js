App.Views.NotificationUpdateForm = App.Views.BootstrapModal.extend({
  template: JST['templates/forms/notification/notification_form'],

  events: {
    'click button[name=close]': 'onClose',
    'click button[name=update]':  'onUpdate',
    'change input[name=teams]': 'onTeamToggle',
  },

  prepareData: function() {
    this.content = this.template();
    this.buttons = '';
    this.buttons += JST['templates/forms/user/buttons/close']();
    this.buttons += JST['templates/forms/user/buttons/edit']();

    this.model = this.options.notification;
    this.model.isChanged = false;

    this.collection = this.options.collection;
    this.exportData = {teams:[]};
    this.notification_teams = this.options.notification_teams;
    this.teams_collection = this.options.teams_collection;
  },

  addListeners: function() {
    this.listenTo(this.model, 'change', this.onChange);
    //this.listenTo(this.model, 'sync', this.onSuccess);
  },

  renderAssistant: function() {
    this.setFormValues();
  },

  onClose: function(event) {
    this.hide();
  },

  hide: function() {
    this.$el.modal('hide');
  },

  onUpdate: function() {
    this.getChechkedTeams();
    var isValid = false;

    this.getFormValues();
    isValid = this.model.isValid(true);

    if (isValid && this.model.isChanged) {
      this.model.save();
      this.hide();
      this.teams_collection.fetch();
    } else if (isValid && !this.model.isChanged) {
      this.hide();
    }
  },

  onTeamToggle: function(event) {
    this.getChechkedTeams();
  },

  getChechkedTeams: function() {
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

  setFormValues: function() {
    _.each(this.$('input[type=text]'), function(input) {
      input.value = this.model.get(input.name);
    }, this);

    _.each(this.$('input[type=checkbox]'), function(input) {
      $(input).parent().removeClass('active');
      $(input).prop('checked', false);
    }, this);

    _.each(this.$('input[type=checkbox]'), function(input) {
      //$(input).parent().removeClass('active');
      //$(input).attr('checked', 'checked');

      var arr = [];
      arr = this.notification_teams.split(',');
          if ($.inArray(input.value, arr) !== -1) {
            $(input).parent().addClass('active');
            //$(input).attr('checked', 'checked');
            $(input).prop('checked', true);
          }
    }, this);
  },

  onChange: function(model, options) {
    this.model.isChanged = true;
  },

  clearModel: function () {
    this.model.clear({silent:true});
  }
});
