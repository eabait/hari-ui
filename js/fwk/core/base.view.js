/**
 * Base framework View
 * @extends from Backbone.View
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

define(
  [
    'backbone',
    'underscore',
    'handlebars',
    'jquery',
    'statemachine',
    'pubsub'
  ],
  function(Backbone, _, Handlebars, $, StateMachine, PubSub) {
    'use strict';

    var BaseView = Backbone.View.extend({

      //finite-state-machine
      fsm : null,

      //reference to the view's template
      template: null,

      //reference to the compiled template
      cachedTemplate : null,

      //animation hash
      animations : {},

      //events to which this views has been subscribed
      //in the PubSub object
      subscriptions : {},

      name: 'BaseView',

      constructor: function() {
        BaseView.__super__.constructor.apply(this, arguments);

        //Create State Machine
        this.fsm = StateMachine.create({
          initial: 'none',
          cid: _.uniqueId('fsm'),
          events: [
            {name: 'init',    from: 'none',                   to: 'start'},
            {name: 'render',  from: ['start', 'loading',
                                     'displayed'],            to: 'displayed'},
            {name: 'load',    from: ['start', 'displayed'],   to: 'loading'},
            {name: 'hide',    from: ['displayed', 'loading'], to: 'invisible'},
            {name: 'show',    from: 'invisible',              to: 'displayed'},
            {name: 'show',    from: 'loading',                to: 'loading'},
            {name: 'disable', from: ['loading', 'displayed',
                                     'invisible'],            to: 'disabled'},
            {name: 'enable',  from: 'disable',                to: 'enabled'}
          ],
          callbacks : {
            'oninit'    : _.bind(this.doInit, this),
            'onload'    : _.bind(this.doLoad, this),
            'onrender'  : _.bind(this.doRender, this),
            'onshow'    : _.bind(this.showAnimation, this),
            'onhide'    : _.bind(this.hideAnimation, this),
            'ondisable' : _.bind(this.toggle, this),
            'onenable'  : _.bind(this.toggle, this)
          }
        });

        //load animation map
        //TODO: Move to FXManager
        this.animations['show'] = {};
        this.animations['show']['fade'] = $.fn.fadeIn;
        this.animations['show']['slide'] = $.fn.slideDown;
        this.animations['hide'] = {};
        this.animations['hide']['fade'] = $.fn.fadeOut;
        this.animations['hide']['slide'] = $.fn.slideUp;

        this.init();
      },

      defaultAction : function() {
        this.render();
      },

      /**
       * This method must be used for binding a given view to a
       * Mediator event. Using this method we can keep track of all
       * the event the view is binded to, and unbind from them prior
       * disposal
       *
       * @param  {string}   event    event to subscribe to
       * @param  {function} callback callback for the event
       * @param  {number}   priority for the event. Can be left undefined
       */
      subscribe : function(event, callback) {
        if (!event) {
          throw new Error('Hari UI Error: Provide an event topic to subscribe to - base.view.js');
        }
        if (!callback || !_.isFunction(callback)) {
          throw new Error('Hari UI Error: Provide a valid callback function for event: ' + event);
        }

        this.subscriptions[event] = PubSub.subscribe(event, callback);
      },

      /**
       * This method will unsubscribe this view from all the
       * events it has been subscribed to
       * @return {Object} return this
       */
      unSubscribeAll : function() {
        var topic;
        for (topic in this.subscriptions) {
          PubSub.unsubscribe(this.subscriptions[topic]);
        }
        return this;
      },

      /**
       * Test if the view is in a given state
       * @param  {string}  state State to be tested for
       * @return {boolean}       Returns whether the view is in that state
       *                         or not
       */
      is : function(state) {
        return this.fsm.is(state);
      },

      /**
       * @Override by Views to initilize
       * the object. Called during construction
       */
      doInit : function() {
      },

      /**
       * @Override by Views that load data
       * Default implementation fetches data from
       * model
       */
      doLoad : function() {
        this.model.fetch();
      },

      /**
       * @Override by all Views
       */
      doRender : function() {
        //NO-OP
      },

      /**
       * @Override by Views that can be disabled
       */
      toggle : function() {
        //NO-OP
      },

      /**
       * TODO: Use FXManager
       * Applies the correct animation. Animation is
       * specified when creating the widget
       */
      showAnimation : function() {
        if (this.options.onshow) {
          this.animations['show'][this.options.onshow].apply(this.$el);
        } else {
          this.$el.toggle();
        }
      },

      /**
       * TODO: Use FXManager
       * Applies the correct animation. Animation is
       * specified when creating the widget
       */
      hideAnimation : function() {
        if (this.options.onhide) {
          this.animations['hide'][this.options.onhide].apply(this.$el);
        } else {
          this.$el.toggle();
        }
      },

      /**
       * Transition methods-----------------
       */
      init : function() {
        this.fsm.init();
        //check template
        if (!this.template) {
          throw new Error('Hari UI: a template must be specified');
        }
        //compile template and save compiled function
        this.cachedTemplate = Handlebars.compile(this.template);
      },

      render : function() {
        //console.log(this.name + ' ' + 'rendering');
        if (this.preRender && _.isFunction(this.preRender)) {
          this.preRender();
        }
        this.fsm.render();
        if (this.postRender && _.isFunction(this.postRender)) {
          this.postRender();
        }
        //console.log(this.name + ' ' + 'end rendering');
      },

      load : function() {
        //console.log(this.name + ' ' + 'loading');
        this.fsm.load();
        //console.log(this.name + ' ' + 'end loading');
      },

      show : function(cb) {
        //console.log(this.name + ' ' + 'showing');
        if (cb && _.isFunction(cb)) {
          _.delay(cb, 300);
        }
        this.fsm.show();
        //console.log(this.name + ' ' + ' end showing');
      },

      hide : function(cb) {
        if (cb && _.isFunction(cb)) {
          _.delay(cb, 300);
        }
        this.fsm.hide();
      },

      disable : function() {
        this.fsm.disable();
      },

      enable : function() {
        this.fsm.enable();
      },
      //End of transition methods-------------

      /**
       * Clean up function. Frees object memory
       * Generic implementation:
       *  - removes DOM reference
       *  - unbinds from model and mediator
       *  - deletes common internal attributes:
       *    + el, $el, options, model, fsm, cachedTemplate
       *    + animations
       */
      disposal : function() {
        //Remove created elements inside $el
        this.$el.empty();

        var properties = [
          'el', '$el',
          'options', 'model',
          'fsm', 'cachedTemplate',
          'animations', 'name', 'subscriptions'
        ];
        var topic;

        if (this.model) {
          this.model.off(null, null, this);
        }

        this.unSubscribeAll();

        for (topic in this.subscriptions) {
          delete this.subscriptions[topic];
        }

        for (var prop in properties) {
          if (this.hasOwnProperty(prop)) {
            delete this[prop];
          }
        }
      }
    });

    return BaseView;
  }
);