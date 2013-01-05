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
     * Main application module
     * @type {BaseModule}
     */
    var Application = BaseModule.extend({

      start : function() {
        this.viewManager.render();
        if (!Backbone.history.started) {
          Backbone.history.start({root: 'hari-ui'});
        }
      }

    });

    /**
     * Instance of ContainerView that will act as
     * container of application's views
     * @type {ContainerView}
     */
    var viewManager = new ContainerView({
      el: 'body',
      template: AppTpl
    });

    return new Application({
      router : new AppRouter(viewManager),
      viewManager : viewManager
    });
  }
);
