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
    'backbone' : 'vendor/backbone/backbone',
    'jquery' : 'vendor/jquery/jquery-1.8.0',
    'underscore' : 'vendor/underscore/underscore',
    'handlebars' : 'vendor/handlebars/handlebars-1.0.0.beta.6',
    'statemachine' : 'vendor/statemachine/state-machine',
    'modernizr' : 'vendor/modernizr/modernizr-wrapper',
    'text' : 'vendor/require/plugins/text',
    'pubsub' : 'vendor/pubsub/pubsub',
    'bootstrap' : 'vendor/jquery/plugins/bootstrap'
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
    Aplication.init();
  }
);
