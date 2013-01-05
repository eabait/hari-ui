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
  function(Backbone, _, Handlebars, $, Stately, PubSub) {
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
        var that = this;
        BaseView.__super__.constructor.apply(this, arguments);

        //Create State Machine
        this.fsm = Stately.machine({
          'none' : {
            init: function() {
              that.doInit();
              return this.started;
            }
          },
          'started' : {
            render: function() {
              try {
              that.doRender();
            } catch(e) {
              console.log(e);
            }
              return this.displayed;
            },
            load: function() {
              that.doLoad();
              return this.loaded;
            },
            dispose: function() {
              that.disposal();
              return this.disposed;
            }
          },
          'displayed' : {
            render: function() {
              that.doRender();
              //return this.displayed;
            },
            hide: function() {
              that.doHideElement();
              return this.hidden;
            },
            dispose: function() {
              that.disposal();
              return this.disposed;
            }
          },
          'loaded': {
            render: function() {
              that.doRender();
              return this.displayed;
            },
            dispose: function() {
              that.disposal();
              return this.disposed;
            }
          },
          'hidden': {
            show: function() {
              that.doShowElement();
              return this.displayed;
            },
            dispose: function() {
              that.disposal();
              return this.disposed;
            }
          },
          'disposed': {}
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
        return this.fsm.getMachineState() === state;
      },

      /**
       * [can description]
       * @param  {[type]} transition [description]
       * @return {[type]}            [description]
       */
      can : function(transition) {
        var trans = this.fsm.getMachineEvents();
        return _.indexOf(trans, transition) !== -1;
      },

      addPreTransition : function(transition, cb, context) {
        this.fsm['onbefore' + transition] = _.bind(cb, context || this);
      },

      addPostTransition : function(transition, cb, context) {
        this.fsm['onafter' + transition] = _.bind(cb, context || this);
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
        this.fsm.render();
      },

      load : function() {
        this.fsm.load();
      },

      show : function() {
        this.fsm.show();
      },

      hide : function() {
        this.fsm.hide();
      },

      dispose : function() {
        // if (this.fsm.can('dispose')) {
        this.fsm.dispose();
        // }
        // this.fsm.dispose();
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