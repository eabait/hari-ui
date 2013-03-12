/**
 * RequireJS bootstrap
 *
 * 1) Will load RequireJS's config file, that would set paths, and will shim non-AMD scripts
 * 2) Will call Application's start method to begin the application bootstrap process
 *
 * @author Esteban S. Abait <esteban.abait@globant.com>
 */
require(
  [
    './js/config.js'
  ],
  function() {
    'use strict';
    //Start ApplicationModule
    require(
      [
        'app/application.module'
      ],
      function(Application) {
        Application.start();
      });
  }
);

