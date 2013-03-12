module.exports = function(grunt) {
  'use strict';

  // ==========================================================================
  // Project configuration
  // ==========================================================================
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clean build directory
    clean: ['lib'],

    // jasmine testsuites
    jasmine: {
      customRunner : {
        amd: true,
        src: 'www/js/**/*.js',
        specs: 'www/tests/**/*.spec.js',
        helpers: [
          'www/js/vendor/require/require.js',
          'www/js/main.js'
        ]
      }
    },

    // tasks to be executed and files
    // to be watched for changes
    watch: {
      files: ['js'],
      tasks: ['jshint:all', 'jasmine']
    },

    // SINGLE TASKS
    // ----------------------

    // require js
    requirejs: {
      compile: {
        options: {
          //configuration file
          mainConfigFile: 'www/js/config.js',
          // optimize javascript files with uglifyjs
          optimize: 'uglify',
          // define dependencies
          include: ['app/application.module'],
          //output file
          out: 'lib/hariui.min.js'
        }
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: 'JST',
          amd: true,
          processName: function(filename) {
            var pieces = filename.split('/');
            return pieces[pieces.length - 1];
          }
        },
        files: {
          'www/js/app/templates.js': 'www/js/**/*.tpl.html'
        }
      }
    },

    // js linting options
    jshint: {
      all: ['gruntfile.js', 'www/js/main.js', 'www/js/app/**/*.js', 'www/js/fwk/**/*.js', 'www/js/tests/**/*.js', '!www/js/app/templates.js'],
      jshintrc: '.jshintrc'
    },

    server: {
      port: 8888,
      base: './'
    }

  });

  // grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // default build task
  grunt.registerTask('default', 'build');

  // build task
  grunt.registerTask('build', ['clean', 'jshint:all', 'handlebars', /*'jasmine',*/ 'requirejs']);

  // launch node server to view the projct
  grunt.registerTask('launch', 'server watch');

};