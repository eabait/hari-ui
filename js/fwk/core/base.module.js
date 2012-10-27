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
  function(Backbone, ContainerView, _, StateMachine) {
    'use strict';

    var BaseModule = function(options) {
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

      this.fsm = StateMachine.create({
        initial: 'started',
        cid: _.uniqueId('fsm'),
        events: [
          {name: 'start',   from: 'none', to: 'started'},
          {name: 'dispose', from: 'started', to: 'disposed'}
        ],
        callbacks : {
          'onstart'    : _.bind(this.start, this),
          'ondispose'  : _.bind(this.dispose, this)
        }
      });
    };

    _.extend(BaseModule.prototype, Backbone.Events, {

      /**
       * @Override
       */
      start : function() {
      },

      dispose: function() {
        //@TODO
        //DISPOSE MODULE
      }

    });

    BaseModule.extend = Backbone.View.extend;

    return BaseModule;

  }
);