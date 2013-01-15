module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-jasmine-task');

  // ==========================================================================
  // Project configuration
  // ==========================================================================

  grunt.initConfig({
    // MULTI TASKS
    // -----------

    // clean build directory
    clean: ['dist'],

    //js linting
    lint: {
      files: ['js/app/**/*.js', 'js/fwk/**/*.js']
    },

    // jasmine testsuites
    jasmine: {
      files: ['js/tests/SpecRunner.html']
    },

    // tasks to be executed and files
    // to be watched for changes
    watch: {
      files: ['<config:lint.files>'],
      tasks: ['lint', 'jasmine']
    },

    // SINGLE TASKS
    // ----------------------

    // require js
    requirejs: {
      std: {
        // build directory path
        dir: '../app-dist',
        // application directory
        appDir: 'js',

        mainConfigFile: 'js/main.js',
        // base url for retrieving paths
        baseUrl: './',

        // setup paths
        // optimize javascript files with uglifyjs

        optimize: 'uglify',

        // define our app model
        modules: [{
          name: 'app'
        }]
      },

      include: 'std'
    },

    // Configuration
    // -------------

    // js linting options
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        nomen: false
      },
      globals: {
        console: true,
        require: true,
        define: true,
        $: true
      }
    },

    server: {
      port: 8888,
      base: './'
    }

  });

  // build task
  grunt.registerTask('build', 'clean lint jasmine');

  // default build task
  grunt.registerTask('default', 'build');

  // launch node server to view the projct
  grunt.registerTask('launch', 'server watch');

};