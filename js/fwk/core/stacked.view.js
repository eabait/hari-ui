/**
 * Stacked View
 * @extends from BaseView
 *
 * Allows showing one view inside a region while hidding the rest
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

define(
  [
    'base.view'
  ],
  function(BaseView) {
    'use strict';

    var StackedView = BaseView.extend({

      name: 'StackedView',

      viewMap: {},

      active: null,

      constructor: function() {
        this.data = {};
        this.viewMap = {};
        this.template = '<div></div>';//a default template, wont be rendered
        StackedView.__super__.constructor.apply(this, arguments);
      },

      addView : function(view, active) {
        this.viewMap[view.cid] = view;
        this.active = active ? view : this.active;
      },

      showView : function(viewId) {
        var view = this.viewMap[viewId];
        var viewWrapper = 'wrapper-' + view.cid;
        var wrapperEl = $('#' + viewWrapper);

        if (!this.is('started')) {
          wrapperEl.css('display', 'none');
          this.active.hide();
          this.active = view;
        }

        if (view.can('render')) {
          this.$el.append('<div id="' + viewWrapper + '"></div>');
          view.setElement('#' + viewWrapper);
          view.defaultAction();
        } else {
          if (view.can('show')) {
            wrapperEl.css('display', 'block');
            view.show();
          }
          else {
            throw new Error('Hari UI: View ' + view.cid +
              ' is in a state that cannot be displayed: ' +
              view.fsm.current);
          }
        }
      },

      /**
       */
      doRender : function() {
        //this.$el.html(this.cachedTemplate(this.data));
        if (!this.active) {
          throw new Error('Hari UI: there is no active view to be displayed');
        }
        this.showView(this.active.cid);
      },

      /**
       */
      disposal : function() {
        BaseView.prototype.disposal.apply(this);
        for (var view in this.regions) {
          this.viewMap[view].dispose();
        }
      }
    });

    return StackedView;
  }
);