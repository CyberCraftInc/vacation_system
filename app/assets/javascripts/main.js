var ENTER_KEY = 13;
_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

window.App = {
  Helpers: {},
  Collections: {},
  Router: {},
  Models: {},
  Views: {},

  Vacation: {
    statuses: {
      requested:  'requested',
      accepted:   'accepted',
      declined:   'declined',
      cancelled:  'cancelled',
      inprogress: 'inprogress',
      used:       'used'
    },

    types: {
      planned:    'planned',
      unpaid:     'unpaid',
      sickness:   'sickness'
    }
  }
};
