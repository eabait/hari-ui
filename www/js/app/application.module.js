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
    './application.router'
  ],
  function(Backbone, BaseModule, ContainerView, AppRouter, JST) {
    'use strict';

    return new BaseModule({
      router : new AppRouter(),
      viewManager : new ContainerView({
        el: 'body',
        template: 'application.tpl.html'
      })
    });

  }
);
