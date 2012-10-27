/**
 * Bootstrap application
 *
 * @author Esteban S. Abait <esteban.abait@globant.com>
 */
define(
  [
    './modules/example/example.view'
  ],
  function(ExampleView) {
    'use strict';

    var example = new ExampleView();
    example.render();
  }
);
