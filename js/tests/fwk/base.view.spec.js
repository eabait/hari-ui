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
    describe('intialization', function() {
      it('throws an exception if no template specified', function() {
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
    describe('states', function() {

      it('initial state should be start', function() {
        var RenderView = BaseView.extend({
          template: testTpl
        });
        var view = new RenderView();
        expect(view.fsm.current).toBe('start');
      });

    });

    /**
     * Test disposal of a view
     */
    describe('disposal', function() {
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
        expect(true).toBe(false);
      });
    });

  }
);

