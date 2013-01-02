/**
 * BaseView Jasmine Spec
 *
 * @author Esteban S. Abait <estebanabait@gmail.com>
 */
define(
  [
    'base.view',
    'pubsub',
    'text!./testView.tpl.html'
  ],
  function(BaseView, PubSub, testTpl) {
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
      });

      afterEach(function() {
        view.dispose();
      });

      it('initial state should be <start>', function() {
        expect(view.fsm.current).toBe('start');
      });

      it('state after -render- must be <displayed>', function() {
        view.render();
        expect(view.fsm.current).toBe('displayed');
      });

      it('state after -load- must be <loading>', function() {
        view.load();
        expect(view.fsm.current).toBe('loading');
      });

      it('state after -hide- must be <invisible>', function() {
        view.render();
        expect(view.fsm.current).toBe('displayed');
        view.hide();
        expect(view.fsm.current).toBe('invisible');
      });

      it('state after -show- must be <displayed>', function() {
        view.render();
        expect(view.fsm.current).toBe('displayed');
        view.hide();
        expect(view.fsm.current).toBe('invisible');
        view.show();
        expect(view.fsm.current).toBe('displayed');
      });

      it('state after -enable- must be <enabled>', function() {
        // view.show();
        // expect(view.fsm.current).toBe('displayed');
      });

      it('state after -disable- must be <disabled>', function() {
        // view.show();
        // expect(view.fsm.current).toBe('displayed');
      });
    });

    describe('BaseView DOM manipulation according to transitions', function() {
      var RenderView = BaseView.extend({
        template: testTpl,
        el: '#test'
      });
      var view;

      beforeEach(function() {
        view = new RenderView();
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
        }).toThrow(new Error('Hari UI Error: render caused an error going from disposed to disposed.' +
          ' Message event render inappropriate in current state disposed with args ')
        );
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

