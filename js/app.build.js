({
    //The top level directory that contains your app. If this option is used
    //then it assumed your scripts are in a subdirectory under this path.
    //This option is not required.
    appDir : "../",

    //By default, all modules are located relative to this path.
    baseUrl : "js",

    //The directory path to save the output. If not specified, then
    //the path will default to be a directory called "build" as a sibling
    //to the build file. All relative paths are relative to the build file.
    dir : "../app-build",

    //List the modules that will be optimized. All their immediate and deep
    //dependencies will be included in the module's file when the build is
    //done. If that module or any of its dependencies includes i18n bundles,
    //only the root bundles will be included unless the locale: section is set above.
    modules: [
      //Just specifying a module name means that module will be converted into
      //a built file that contains all of its dependencies.
      {
        name : "main"
      }
    ],

    //Set paths for modules. If relative paths, set relative to baseUrl above.
    paths: {
      'base.view'       : '../js/fwk/core/base.view',
      'container.view'  : '../js/fwk/core/container.view',
      'base.module'     : '../js/fwk/core/base.module',
      'backbone'        : '../js/vendor/backbone/backbone',
      'jquery'          : '../js/vendor/jquery/jquery-1.8.0',
      'underscore'      : '../js/vendor/underscore/underscore',
      'handlebars'      : '../js/vendor/handlebars/handlebars-1.0.0.beta.6',
      'statemachine'    : '../js/vendor/statemachine/state-machine',
      'modernizr'       : '../js/vendor/modernizr/modernizr-wrapper',
      'text'            : '../js/vendor/require/plugins/text',
      'pubsub'          : '../js/vendor/pubsub/pubsub',
      'bootstrap'       : '../js/vendor/jquery/plugins/bootstrap',
      'fxmanager'       : '../js/fwk/core/fxmanager'
    }
})