/**
 * Creates the main application module
 *
 * @author Esteban S. Abait <esteban.abait@globant.com>
 */
define(
  [
    'backbone',
    'base.module',
    'container.view',
    './application.router',
    'text!./application.tpl.html'
  ],
  function(Backbone, BaseModule, ContainerView, AppRouter, AppTpl) {
    'use strict';

    /**
     * Instance of ContainerView to be used as a ViewManager
     * @type {ContainerView}
     */
    var ViewManager = ContainerView.extend({

      setUp : function() {
        this.template = AppTpl;
      }

    });

    /**
     * Main application module
     * @type {BaseModule}
     */
    var Application = BaseModule.extend({

      start : function() {
        this.viewManager.render();
        if (!Backbone.history.started) {
          Backbone.history.start();
        }
      }

    });

    var viewManager = new ViewManager({
      el: 'body'
    });

    return new Application({
      router : new AppRouter(viewManager),
      viewManager : viewManager
    });
  }
);
