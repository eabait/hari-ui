/**
 * BaseView Jasmine Spec
 *
 * @author Esteban S. Abait <estebanabait@gmail.com>
 */
define(
  [
    'container.view',
    'base.view',
    'pubsub',
    'text!./containerview.tpl.html'
  ],
  function(ContainerView, BaseView, PubSub, containerTpl) {
    'use strict';

    describe('ContainerView add sub views', function() {
      var container;
      var header;
      var content;
      var footer;

      beforeEach(function() {
        container = new ContainerView({
          el: '#test',
          template: containerTpl
        });
        header = new BaseView({
          template: '<div id="subview1"></div>'
        });
        footer = new BaseView({
          template: '<div id="subview2"></div>'
        });
        content = new BaseView({
          template: '<div id="subview3"></div>'
        });
      });

      afterEach(function() {
        container.dispose();
      });

      it('adds DOM elements for all added subviews when -render- is invoked', function() {
        container.addView('header', header);
        container.addView('footer', footer);
        container.addView('#mainContent', content);

        container.render();

        //The DOM element exists
        expect(container.$el.find('header')).toExist();
        expect(container.$el.find('footer')).toExist();
        expect(container.$el.find('#mainContent')).toExist();
        //and is contained inside the view DOM root element
        expect(container.$el).toContain('header');
        expect(container.$el).toContain('footer');
        expect(container.$el).toContain('#mainContent');
      });

      it('transition from one view to another', function() {
        var anotherView = new BaseView({
          template : '<div id="another"></div>'
        });

        container.addView('header', header);
        container.addView('footer', footer);
        container.addView('#mainContent', content);

        container.render();

        //The DOM element exists
        expect(container.$el.find('#subview1')).toExist();
        expect(container.$el.find('#subview2')).toExist();
        expect(container.$el.find('#subview3')).toExist();
        //and is contained inside the view DOM root element
        expect(container.$el).toContain('#subview1');
        expect(container.$el).toContain('#subview2');
        expect(container.$el).toContain('#subview3');

        container.subViewTransition({
          region: '#mainContent',
          newView: anotherView,
          transition: 'bounce'
        });

        //The DOM element exists
        expect(container.$el.find('#subview1')).toExist();
        expect(container.$el.find('#subview2')).toExist();
        expect(container.$el.find('#another')).toExist();
        //and is contained inside the view DOM root element
        expect(container.$el).toContain('#subview1');
        expect(container.$el).toContain('#subview2');
        expect(container.$el).toContain('#another');
      });

      // it('hides DOM elements when -hide- is invoked', function() {
      //   view.render();
      //   expect(view.$el.find('#testView')).toExist();

      //   view.hide();
      //   expect(view.$el).toBeHidden();
      // });

      // it('shows DOM elements when -show- is invoked', function() {
      //   view.render();
      //   expect(view.$el.find('#testView')).toExist();

      //   view.hide();
      //   expect(view.$el).toBeHidden();

      //   view.show();
      //   expect(view.$el).not.toBeHidden();
      // });
    });

    /**
     * Test disposal of a view
     */
    describe('ContainerView disposal', function() {
      var container;
      var header;
      var content;
      var footer;

      beforeEach(function() {
        container = new ContainerView({
          el: '#test',
          template: containerTpl
        });
        header = new BaseView({
          template: '<div id="subview1"></div>'
        });
        footer = new BaseView({
          template: '<div id="subview2"></div>'
        });
        content = new BaseView({
          template: '<div id="subview3"></div>'
        });
      });

      it('cannot be used after disposal', function() {
        container.addView('header', header);
        container.addView('footer', footer);
        container.addView('#mainContent', content);

        container.render();
        container.dispose();

        expect(function() {
          container.render();
        }).toThrow(new Error('Stately: invalid transition render in state disposed'));

      });

      // it('cannot be subscribed to events after disposal', function() {
      //   spyOn(view, 'listenEvent');

      //   view.subscribe('testEvent', view.listenEvent);
      //   view.dispose();
      //   PubSub.publish('testEvent');

      //   expect(view.listenEvent).not.toHaveBeenCalled();
      // });

      // it('must clean up DOM after disposal', function() {
      //   expect(view.$el).toBeEmpty();
      // });
    });

  }
);

