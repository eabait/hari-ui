/**
 * RequireJS bootstrap
 *
 * @author Esteban S. Abait <esteban.abait@globant.com>
 */
require.config({
  //path aliases for loaded scripts
  paths: {
    'base.view' : 'fwk/core/base.view',
    'container.view' : 'fwk/core/container.view',
    'stacked.view' : 'fwk/core/stacked.view',
    'list.view' : 'fwk/core/list.view',
    'base.module' : 'fwk/core/base.module',
    'backbone' : 'vendor/backbone/backbone',
    'jquery' : 'vendor/jquery/jquery-1.8.0',
    'underscore' : 'vendor/underscore/lodash',
    'handlebars' : 'vendor/handlebars/handlebars-1.0.0.beta.6',
    'statemachine' : 'vendor/statemachine/Stately',
    'modernizr' : 'vendor/modernizr/modernizr-wrapper',
    'text' : 'vendor/require/plugins/text',
    'pubsub' : 'vendor/pubsub/pubsub',
    'lawnchair' : 'vendor/lawnchair/lawnchair-0.6.1'
  },
  //load script's dependencies in correct order &
  //wraps non-AMD scripts into AMD-modules
  shim: {
    'underscore' : {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'modernizr': {
      exports : 'Modernizr'
    },
    'handlebars': {
      exports : 'Handlebars'
    }
  }
});

require(
  [
    'app/application.module'
  ],
  function(Aplication) {
    'use strict';
    Aplication.start();
  }
);
