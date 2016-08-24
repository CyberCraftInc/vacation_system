App.Collections.Notifications = Backbone.Collection.extend({
    url: '/notifications',
    model: App.Models.Notification
});
