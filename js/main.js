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
    'jqGrid' : 'vendor/jquery/plugins/jquery.jqGrid.src',
    'pubsub' : 'vendor/pubsub/pubsub',
    'jquery.ui' : 'vendor/jquery/plugins/jquery-ui-1.8.23.custom',
    'jqAnimate' : 'vendor/jquery/plugins/jquery.animate-enhanced',
    'jsplumb' : 'vendor/jsplumb/jquery.jsPlumb-1.3.12-all',
    'bootstrap' : 'vendor/jquery/plugins/bootstrap',
    'd3' : 'vendor/d3/d3.v2',

    // raphael libraries needed:
    'eve' : 'vendor/raphael/eve',
    'raphael' : 'vendor/raphael/raphael.amd',
    'raphaelcore' : 'vendor/raphael/raphael.core',
    'raphaelsvg' : 'vendor/raphael/raphael.svg',
    'raphaelvml' : 'vendor/raphael/raphael.vml'
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
    'jqGrid' : {
      deps : ['jquery'],
      exports : '$.jgrid'
    },
    'jquery.ui' : {
      deps : ['jquery']
    },
    'uiAutocomplete' : {
      deps : ['jquery', 'jquery.ui']
    },
    'raphael' : {
      deps : ['jquery'],
      exports : 'raphael'
    },
    'jqAnimate' : {
      deps : ['jquery']
    },
    'jsplumb' : {
      deps : ['jquery', 'jquery.ui'],
      exports: 'jsPlumb'
    },
    'd3' : {
      exports : 'd3'
    }
  }
});

require(
  [
    'app/bootstrap'
  ],
  function(bootstrap) {
    'use strict';
    bootstrap.init();
  }
);
