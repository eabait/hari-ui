/**
 * Main window router
 * Load and unload other modules
 */
define([
    'backbone',
    'pubsub',
    './mainwindow.view',
    'app/modules/designstudio/views/designstudio.view',
    'app/modules/solutionbrowser/views/solutionbrowser.view',
    'app/modules/myinstances/views/myinstances.view',
    'app/modules/modelbrowser/views/modelbrowser.view',
    'app/modules/policyeditor/views/policyeditor.view',
    'app/modules/modeleditor/views/modeleditor.view',
    'app/modules/processeditor/views/processeditor.view'
  ],

  function(Backbone, PubSub, MainWindow, DesignStudio, SolutionBrowser, MyInstancesView, ModelBrowser, PolicyEditor,
    ModelEditor, ProcessEditor) {

    'use strict';

    var AppRouter = Backbone.Router.extend({

      routes : {
        'designstudio'       : 'loadDesignStudio',
        'solutionbrowser'    : 'loadSolutionBrowser',
        'myinstances'        : 'loadMyInstances',
        'model/new'          : 'loadModelEditor',
        'process/edit/:id'   : 'loadProcessEditor',
        'process/new'        : 'newProcess',
        'policy/edit/:id'    : 'loadPolicyView',
        '*path'              : 'defaultAction'
      },

      initialize : function() {
        var self = this;
        PubSub.subscribe('navigation', function(channel, e) {
          if (e.src === 'Menu') {
            self.navigate('/#' + e.to);
          }
        });
      },

      loadSolutionBrowser : function() {
        var self = this;
        MainWindow.subViewTransition({
          region: '.main-container',
          newView:  SolutionBrowser,
          transition: 'fadeInRightBig'
        });
      },

      loadModelEditor : function() {
        var self = this;
        PubSub.subscribe('navigation.modeleditor', function(channel, e) {
          if (e.to === 'editAction') {
            self.navigate('/#process/edit/' + e.data.processAction);
          }
        });
        PubSub.unsubscribe('navigation.modelbrowser');
        MainWindow.subViewTransition({
          region: '.main-container',
          newView: new ModelEditor(),
          transition: 'fadeInRightBig'
        });
      },

      loadPolicyView : function() {
        MainWindow.subViewTransition({
          region: '.main-container',
          newView: new PolicyEditor(),
          transition: 'fadeInRightBig'
        });
      },

      loadProcessEditor : function(id) {
        var self = this;
        PubSub.subscribe('navigation', function(channel, e) {
          if (e.to === 'Policies') {
            self.navigate('/#policy/edit/1');
          }
        });
        MainWindow.subViewTransition({
          region: '.main-container',
          newView: new ProcessEditor({
            processId: id
          }),
          transition: 'fadeInRightBig'
        });
      },

      newProcess : function() {
        MainWindow.subViewTransition({
          region: '.main-container',
          newView: new ProcessEditor(),
          transition: 'fadeInRightBig'
        });
      },

      loadDesignStudio : function(){
        var self = this;
        MainWindow.subViewTransition({
          region: '.main-container',
          newView:  new DesignStudio(),
          transition: 'fadeInRightBig'
        });
      },

      loadMyInstances : function() {
        var self = this;
        MainWindow.subViewTransition({
          region: '.main-container',
          newView: new MyInstancesView(),
          transition: 'fadeInRightBig'
        });
      },

      defaultAction : function(path) {
        this.navigate('/#designstudio');
      }

    });

    var init = function() {
      MainWindow.render();

      var r = new AppRouter();

      Backbone.history.start();
    };

    return {
      init : init
    };
  }
);
