/**
 * Main window router
 * Load and unload other modules
 */
define([
    'backbone',
    './modules/example/example.module'
  ],

  function(Backbone, ExampleModule) {
    'use strict';

    var AppRouter = Backbone.Router.extend({

      routes : {
        'example' : 'loadExampleModule',
        '*path' : 'defaultAction'
      },

      loadExampleModule : function() {
        this.viewManager.subViewTransition({
          region: '.main-content',
          newView: ExampleModule.viewManager,
          transition: 'fadeIn'
        });
      },

      defaultAction : function(path) {
        this.navigate('example', true);
      }

    });

    return AppRouter;
  }
);
