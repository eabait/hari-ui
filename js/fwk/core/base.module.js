/**
 * @type {Module}
 */
define(
  [
    'backbone',
    'container.view',
    'underscore',
    'statemachine'
  ],
  function(Backbone, ContainerView, _, Stately) {
    'use strict';

    var BaseModule = function(options) {
      var that = this;

      if (!options || !_.isObject(options)) {
        throw new Error('Hari UI: you need to specify module options on creation');
      }

      if (!options.router || !_.isObject(options.router)) {
        throw new Error('Hari UI: a router must be specified when creating a module');
      }
      this.router = options.router;

      if (!options.viewManager || !_.isObject(options.viewManager)) {
        throw new Error('Hari UI: a view manager must be specified when creating a module');
      }
      this.viewManager = options.viewManager;

      this.fsm = Stately.machine({
        'none': {
          start : function() {
            that.init();
            return this.started;
          }
        },
        'started': {
          dispose : function() {
            that.disposal();
          }
        },
        'disposed': {}
      });
    };

    _.extend(BaseModule.prototype, Backbone.Events, {

      /**
       * @Override
       */
      init : function() {
      },

      /**
       * @Override
       */
      disposal : function() {
      },

      /**
       *
       */
      start : function() {
        this.fsm.start();
      },

      /**
       *
       */
      dispose: function() {
        this.fsm.dispose();
      }

    });

    BaseModule.extend = Backbone.View.extend;

    return BaseModule;

  }
);