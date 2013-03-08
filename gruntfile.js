module.exports = function(grunt) {
  'use strict';

  // ==========================================================================
  // Project configuration
  // ==========================================================================
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // clean build directory
    clean: ['app-dist'],

    // jasmine testsuites
    jasmine: {
      files: ['js/tests/SpecRunner.html']
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
          // base url for retrieving paths
          baseUrl: './',
          //output
          dir: './app-dist',
          // application directory
          appDir: './js/',
          //configuration file
          mainConfigFile: 'js/main.js',
          // optimize javascript files with uglifyjs
          optimize: 'uglify',
          // define our app model
          modules: [{
            name: 'main'
          }]
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
          'js/app/templates.js': 'js/**/*.tpl.html'
        }
      }
    },

    // js linting options
    jshint: {
      all: ['gruntfile.js', 'js/main.js', 'js/app/**/*.js', 'js/fwk/**/*.js', 'js/tests/**/*.js', '!js/app/templates.js'],
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
  grunt.registerTask('build', ['clean', 'jshint:all', 'handlebars', 'jasmine', 'requirejs']);

  // launch node server to view the projct
  grunt.registerTask('launch', 'server watch');

};