var Workspace = Backbone.Router.extend({
  routes:{
    '': 'index'
  },

  index: function() {
    alert('Home page');
    console.log('Home page');
  }

});

app.TodoRouter = new Workspace();
Backbone.history.start();
