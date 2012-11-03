/**
 * BaseView Jasmine Spec
 */
define(
  [
    '../../fwk/core/base.view',
    'text!./testView.tpl.html'
  ],
  function(BaseView, testTpl) {
    'use strict';

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

    // use jasmine to run tests against the required code
    describe('states', function() {

      it('initial state should be start', function() {
        var RenderView = BaseView.extend({
          template: testTpl
        });
        var view = new RenderView();
        expect(view.fsm.current).toBe('start');
      });

    });

  }
);

