/**
 * RequireJS bootstrap
 *
 * @author Esteban S. Abait <esteban.abait@globant.com>
 */
require(
  [
    'js/fwk/config.js'
  ],
  function(Config) {
    'use strict';

    //1) Set requirejs configuration. This will set paths
    //for all vendors and fwk dependencies/objects
    require.config(Config);

    //2) Start ApplicationModule
    require(
      [
        'app/application.module'
      ],
      function(Application) {
        Application.start();
      });
  }
);
