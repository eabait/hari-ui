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

    return new BaseModule({
      router : new AppRouter(),
      viewManager : new ContainerView({
        el: 'body',
        template: AppTpl
      })
    });

  }
);
