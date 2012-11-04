/**
 * BaseView Jasmine Spec
 *
 * @author Esteban S. Abait <estebanabait@gmail.com>
 */
define(
  [
    '../../fwk/core/base.view',
    'text!./testView.tpl.html'
  ],
  function(BaseView, testTpl) {
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
      it('cannot be used after disposal', function() {

      });

      it('cannot be subscribed to events after disposal', function() {

      });

      it('must clean up DOM after disposal', function() {

      });
    });

  }
);

