var app = app || {};

app.AppView = Backbone.View.extend({
  initialize: function() {
    alert('Hi there!');
    console.log('app.AppView');
    // this.allCheckbox  = this.$('#toggle-all')[0];
    // this.$input       = this.$('#new-todo');
    // this.$footer      = this.$('#footer');
    // this.$main        = this.$('#main');
    //
    // this.listenTo(app.Todos, 'add',     this.addOne);
    // this.listenTo(app.Todos, 'reset',   this.addAll);
    // this.listenTo(app.Todos, 'change:completed',  this.filterOne);
    // this.listenTo(app.Todos, 'filter',  this.filterAll);
    // this.listenTo(app.Todos, 'all',     this.render);
    //
    // app.Todos.fetch();
  },

});
