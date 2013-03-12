define(function() {
  'use strict';

  require.config({
    //path aliases for loaded scripts
    paths: {
      'base.view' : 'fwk/core/base.view',
      'container.view' : 'fwk/layoutmanagers/container.view',
      'stacked.view' : 'fwk/layoutmanagers/stacked.view',
      'list.view' : 'fwk/layoutmanagers/list.view',
      'base.module' : 'fwk/core/base.module',
      'cache' : 'fwk/transport/cache',
      'backbone' : 'vendor/backbone/backbone-0.9.10',
      'jquery' : 'vendor/jquery/jquery-1.8.0',
      'transit' : 'vendor/jquery/plugins/jquery.transit',
      'underscore' : 'vendor/underscore/lodash',
      'handlebars' : 'vendor/handlebars/handlebars-1.0.0.beta.6',
      'statemachine' : 'vendor/statemachine/Stately',
      'modernizr' : 'vendor/modernizr/modernizr-latest',
      'text' : 'vendor/require/plugins/text',
      'pubsub' : 'vendor/pubsub/pubsub',
      'lawnchair' : 'vendor/lawnchair/lawnchair-0.6.1',
      'jst' : 'app/templates'
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
      },
      'lawnchair' : {
        exports: 'Lawnchair'
      },
      'transit': {
        deps: ['jquery'],
        exports : 'Transit'
      }
    }
  });
});
