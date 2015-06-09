var Workspace = Backbone.Router.extend({
  routes:{
    '': 'index'
  },

  index: function() {
    console.log('Home page');
  }

});

app.TeamsRouter = new Workspace();
Backbone.history.start();
