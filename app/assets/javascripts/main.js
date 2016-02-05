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
      regular:    'regular',
      sickness:   'sickness',
      unpaid:     'unpaid'
    }
  },

  TeamView: {
    modes: {
      readonly: 0,
      editable: 1
    }
  },

  TeamRoles: {
    guest: 'guest',
    member: 'member',
    manager: 'manager',
    admin: 'admin'
  }
};
