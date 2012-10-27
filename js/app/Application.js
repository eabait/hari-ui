/**
 * Bootstrap application
 *
 * @author Esteban S. Abait <esteban.abait@globant.com>
 */
define(
  [
    'app/modules/mainwindow/mainwindow.router'
  ],
  function(MainRouter) {

    'use strict';

    window.onerror = function(errorMsg, url, lineNumber) {
      console.log(errorMsg + ' in ' + url + ' at line ' + lineNumber);
      console.trace();
    };

    return {
      init : function() {
        MainRouter.init();
      }
    };
  }
);
