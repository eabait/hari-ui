/**
 * BaseView Jasmine Spec
 *
 * @author Esteban S. Abait <estebanabait@gmail.com>
 */
define(
  [
    'backbone',
    'base.view',
    'pubsub',
    'text!./testView.tpl.html'
  ],
  function(Backbone, BaseView, PubSub, testTpl) {
    'use strict';

    /**
     * Test creation of a view
     */
    describe('BaseView initialization', function() {
      it('throws an exception if no template is specified', function() {
        //Extend BaseView without specifing a template
        var NoTemplateView = BaseView.extend({
        });

        //function that creates a NoTemplateView
        var createNewView = function() {
          var view = new NoTemplateView();
        };

        //Test view throwing an exception
        expect(createNewView).toThrow(
          new Error('Hari UI: a template must be specified')
        );
      });
    });

    /**
     * Test all transitions between states
     */
    describe('BaseView states and transitions', function() {
      var RenderView = BaseView.extend({
        template: testTpl
      });
      var view;

      beforeEach(function() {
        view = new RenderView();
        spyOn(view, 'doLoad').andCallFake(function(params) {
          var deferred = $.Deferred();
          deferred.resolve();
          return deferred;
        });
      });

      afterEach(function() {
        view.dispose();
      });

      it('initial state should be <started>', function() {
        expect(view.fsm.getMachineState()).toBe('started');
      });

      it('state after -render- must be <displayed>', function() {
        view.render();
        expect(view.fsm.getMachineState()).toBe('displayed');
      });

      it('state after -load- must be <loaded>', function() {
        view.load();
        expect(view.fsm.getMachineState()).toBe('loaded');
      });

      it('state after -hide- must be <hidden>', function() {
        view.render();
        expect(view.fsm.getMachineState()).toBe('displayed');
        view.hide();
        expect(view.fsm.getMachineState()).toBe('hidden');
      });

      it('state after -show- must be <displayed>', function() {
        view.render();
        expect(view.fsm.getMachineState()).toBe('displayed');
        view.hide();
        expect(view.fsm.getMachineState()).toBe('hidden');
        view.show();
        expect(view.fsm.getMachineState()).toBe('displayed');
      });
    });

    /**
     * Test all transitions between states
     */
    describe('BaseView transition callbacks', function() {
      var view = null;
      var TestTransitions = {
        pre : function() {},
        post : function() {}
      };

      beforeEach(function() {
        view = new BaseView({
          template: testTpl,
          el: '#test'
        });
      });

      afterEach(function() {
        view.dispose();
      });

      it('calls the post-render callback after render has been invoked', function() {
        spyOn(TestTransitions, 'post');

        view.addPostTransition('render', TestTransitions.post, TestTransitions);
        view.render();

        //The DOM element exists
        expect(TestTransitions.post).toHaveBeenCalled();
      });

      it('calls the post-render callback after render has been invoked', function() {
        spyOn(TestTransitions, 'pre');

        view.addPreTransition('render', TestTransitions.pre, TestTransitions);
        view.render();

        //The DOM element exists
        expect(TestTransitions.pre).toHaveBeenCalled();
      });

      it('calls the pre & post-render callbacks before & after render has been invoked', function() {
        spyOn(TestTransitions, 'pre');
        spyOn(TestTransitions, 'post');

        view.addPreTransition('render', TestTransitions.pre, TestTransitions);
        view.addPostTransition('render', TestTransitions.post, TestTransitions);
        view.render();

        //The DOM element exists
        expect(TestTransitions.pre).toHaveBeenCalled();
        expect(TestTransitions.post).toHaveBeenCalled();
      });
    });

    describe('BaseView DOM manipulation according to transitions', function() {
      var view = null;

      beforeEach(function() {
        view = new BaseView({
          template: testTpl,
          el: '#test'
        });
      });

      afterEach(function() {
        view.dispose();
      });

      it('adds DOM elements when -render- is invoked', function() {
        view.render();

        //The DOM element exists
        expect(view.$el.find('#testView')).toExist();
        //and is contained inside the view DOM root element
        expect(view.$el).toContain('#testView');
      });

      it('hides DOM elements when -hide- is invoked', function() {
        view.render();
        expect(view.$el.find('#testView')).toExist();

        view.hide();
        expect(view.$el).toBeHidden();
      });

      it('shows DOM elements when -show- is invoked', function() {
        view.render();
        expect(view.$el.find('#testView')).toExist();

        view.hide();
        expect(view.$el).toBeHidden();

        view.show();
        expect(view.$el).not.toBeHidden();
      });
    });

    /**
     * Test disposal of a view
     */
    describe('BaseView disposal', function() {
      var RenderView = BaseView.extend({
        template: testTpl,
        listenEvent : function() {
        }
      });
      var view;

      beforeEach(function() {
        view = new RenderView();
      });

      it('cannot be used after disposal', function() {
        view.dispose();

        expect(function() {
          view.render();
        }).toThrow(new Error('Stately: invalid transition render in state disposed'));
      });

      it('cannot be subscribed to events after disposal', function() {
        spyOn(view, 'listenEvent');

        view.subscribe('testEvent', view.listenEvent);
        view.dispose();
        PubSub.publish('testEvent');

        expect(view.listenEvent).not.toHaveBeenCalled();
      });

      it('must clean up DOM after disposal', function() {
        expect(view.$el).toBeEmpty();
      });
    });

  }
);

