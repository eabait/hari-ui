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
          //initial: 'start',
          cid: _.uniqueId('fsm'),
          events: [
            {name: 'init',    from: 'none',                    to: 'start'},
            {name: 'render',  from: ['start', 'loading',
                                     'displayed'],             to: 'displayed'},
            {name: 'load',    from: ['start', 'displayed'],    to: 'loading'},
            {name: 'hide',    from: ['displayed'],             to: 'invisible'},
            {name: 'show',    from: 'invisible',               to: 'displayed'},
            {name: 'disable', from: ['loading', 'displayed',
                                     'invisible'],             to: 'disabled'},
            {name: 'enable',  from: 'disabled',                to: 'enabled'},
            {name: 'dispose', from: ['start', 'loading',
                                     'displayed', 'invisible',
                                     'disabled'],              to: 'disposed'}
          ],
          error: this.transitionErrorHandler
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
       * Default Error handler function for the State Machine
       * @param  {string} eventName    transition that caused the error
       * @param  {string} from         from state
       * @param  {string} to           to state
       * @param  {string} args         arguments
       * @param  {string} errorCode    error code
       * @param  {string} errorMessage error message
       * @return {Error}               returns an Error object
       */
      transitionErrorHandler : function(eventName, from, to, args, errorCode, errorMessage) {
        throw new Error('Hari UI Error: ' + eventName + ' caused an error going from ' +
          from + ' to ' + to + '. Message ' + errorMessage + ' with args ' + args);
      },

      /**
       * @Override by Views to initilize
       * the object. Called during construction
       */
      doInit : function() {
        //NO-OP
      },

      /**
       * @Override by Views that load data
       * Default implementation fetches data from
       * model
       */
      doLoad : function() {
        //NO-OP
      },

      /**
       * Default behavior: renders the cached template
       * @Override by all Views
       */
      doRender : function() {
        var data = null;
        if (this.model) {
          data = this.model.toJSON();
        }
        this.$el[0].innerHTML = this.cachedTemplate(data);
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
      doShowElement : function() {
        if (this.options.onshow) {
          this.animations['show'][this.options.onshow].apply(this.$el);
        } else {
          this.$el.css('display', 'block');
        }
      },

      /**
       * TODO: Use FXManager
       * Applies the correct animation. Animation is
       * specified when creating the widget
       */
      doHideElement : function() {
        if (this.options.onhide) {
          this.animations['hide'][this.options.onhide].apply(this.$el);
        } else {
          this.$el.css('display', 'none');
        }
      },

      /**
       * Transition methods-----------------
       */
      init : function() {
        if (this.fsm.can('init')) {
          this.doInit();
        }
        this.fsm.init();

        //check template
        if (!this.template && !this.options.template) {
          throw new Error('Hari UI: a template must be specified');
        } else
          if (this.options.template) {
            this.template = this.options.template;
          }

        //compile template and save compiled function
        this.cachedTemplate = Handlebars.compile(this.template);
      },

      render : function() {
        // console.log(this.name + ' ' + 'rendering');
        if (this.fsm.can('render')) {
          this.doRender();
        }
        this.fsm.render();
        //console.log(this.name + ' ' + 'end rendering');
      },

      load : function() {
        //console.log(this.name + ' ' + 'loading');
        if (this.fsm.can('load')) {
          this.doLoad();
        }
        this.fsm.load();
        //console.log(this.name + ' ' + 'end loading');
      },

      show : function() {
        //console.log(this.name + ' ' + 'showing');
        if (this.fsm.can('show')) {
          this.doShowElement();
        }
        this.fsm.show();
        //console.log(this.name + ' ' + ' end showing');
      },

      hide : function() {
        if (this.fsm.can('hide')) {
          this.doHideElement();
        }
        this.fsm.hide();
      },

      disable : function() {
        if (this.fsm.can('disable')) {
          this.toggle();
        }
        this.fsm.disable();
      },

      enable : function() {
        if (this.fsm.can('enable')) {
          this.toggle();
        }
        this.fsm.enable();
      },

      dispose : function() {
        if (this.fsm.can('dispose')) {
          this.disposal();
        }
        this.fsm.dispose();
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
          'options', 'model', 'cachedTemplate',
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

        for (var i = 0, l = properties.length; i < l; ++i) {
          if (this.hasOwnProperty(properties[i])) {
            delete this[properties[i]];
          }
        }
      }
    });

    return BaseView;
  }
);