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
    'pubsub',
    'fwk/core/fxmanager',
    'jst'
  ],
  function(Backbone, _, Handlebars, $, Stately, PubSub, FxManager, JST) {
    'use strict';

    var BaseView = Backbone.View.extend({

      //finite-state-machine
      fsm : null,

      //template strings, if specified
      template: null,

      //reference to the compiled template
      cachedTemplate : null,

      //animation hash
      animations : null,

      //events to which this views has been subscribed
      //in the PubSub object
      subscriptions : {},

      //holds UI data to be passed to the
      //cached template
      data : {},

      name: 'BaseView',

      constructor: function() {
        var that = this;
        BaseView.__super__.constructor.apply(this, arguments);

        //Create State Machine
        //ToDo: Refactor duplicated code. Alternatives
        //  - create reusable functions
        //  - roll our own state machine
        this.fsm = Stately.machine({
          'none' : {
            init: function() {
              that.doInit();
              return this.started;
            }
          },
          'started' : {
            render: function() {
              that.doRender();
              return this.displayed;
            },
            load: function() {
              var deferred = that.doLoad();
              var self = this;

              if (!deferred) {
                throw new Error('Hari UI: doLoad must return a deferred object');
              }

              deferred.done(function() {
                self.setMachineState(self.loaded);
              });
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
            load: function() {
              var deferred = that.doLoad();
              var self = this;

              if (!deferred) {
                throw new Error('Hari UI: doLoad must return a deferred object');
              }

              deferred.done(function() {
                self.setMachineState(self.loaded);
              });
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
            load: function() {
              var deferred = that.doLoad();
              var self = this;

              if (!deferred) {
                throw new Error('Hari UI: doLoad must return a deferred object');
              }

              deferred.done(function() {
                self.setMachineState(self.loaded);
              });
            },
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

      before : function(transition, cb, context) {
        this.fsm['onbefore' + transition] = _.bind(cb, context || this);
      },

      after : function(transition, cb, context) {
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
       * @returns {object} Deferred object
       */
      doLoad : function() {
        //NO-OP
      },

      /**
       * Default behavior: renders the cached template
       * @Override by all Views
       */
      doRender : function() {
        var data = this.model ? this.model.toJSON() : this.data;
        this.$el[0].innerHTML = this.cachedTemplate(data);
      },

      initAnimations : function() {
        if (!this.animations) {
          this.animations = {};
          this.animations.fade = FxManager.makeToggable('fade', {
            el: this.$el
          });
          this.animations.slide = FxManager.makeToggable('slide', {
            el: this.$el
          });
        }
      },

      /**
       * Applies the correct animation. Animation is
       * specified when creating the widget
       */
      doShowElement : function() {
        this.initAnimations();
        if (this.options.animation) {
          this.animations[this.options.animation].toggle();
        } else {
          this.$el.css('opacity', '1');
        }
      },

      /**
       * Applies the correct animation. Animation is
       * specified when creating the widget
       */
      doHideElement : function() {
        this.initAnimations();
        if (this.options.animation) {
          this.animations[this.options.animation].toggle();
        } else {
          this.$el.css('opacity', '0');
        }
      },

      /**
       * Transition methods-----------------
       */
      init : function() {
        var hasCachedTemplate;
        var tplFunc;

        this.fsm.init();

        this.template = this.options.template || this.template; //configuration over default value
        this.cachedTemplate = this.cachedTemplate || this.options.cachedTemplate;

        hasCachedTemplate = _.isFunction(this.cachedTemplate);

        //If the view doesnt have a template function
        //look into the templates registry
        if (!hasCachedTemplate) {
          tplFunc = JST[this.template];
          if (_.isFunction(tplFunc)) {
            this.cachedTemplate = tplFunc;
          } else {
            //check template property, and try to compile it
            try {
              if (this.template) {
                this.cachedTemplate = Handlebars.compile(this.template);
              } else {
                throw new Error('Hari UI: a template must be provided');
              }
            } catch(e) {
              throw new Error('Hari UI: the provided template cannot be compiled');
            }
          }
        }
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
          'animations', 'name', 'subscriptions',
          'data'
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