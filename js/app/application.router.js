/**
 * Main window router
 * Load and unload other modules
 */
define([
    'backbone',
    './modules/example/example.view'
  ],

  function(Backbone, ExampleView) {
    'use strict';

    var AppRouter = Backbone.Router.extend({

      routes : {
        'example' : 'loadExampleModule',
        '*path' : 'defaultAction'
      },

      initialize: function(viewManager) {
        this.viewManager = viewManager;
      },

      loadExampleModule : function() {
        var view = new ExampleView();
        this.viewManager.subViewTransition({
          region: '.main-content',
          newView: view,
          transition: 'bounce'
        });
      },

      defaultAction : function(path) {
        this.navigate('/#example');
      }

    });

    return AppRouter;
  }
);
