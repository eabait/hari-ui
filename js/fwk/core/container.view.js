/**
 * Container View
 * @extends from BaseView
 *
 * Allows for the composition of views
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

define(
  [
    'backbone',
    'underscore',
    'jquery',
    'base.view',
    'fwk/core/fxmanager'
  ],
  function(Backbone, _, $, BaseView, FXManager) {
    'use strict';

    var ContainerView = BaseView.extend({

      name: 'ContainerView',

      constructor: function() {
        ContainerView.__super__.constructor.apply(this, arguments);
        this.regions = {};
        this.data = {};
      },

      addView : function(region, view) {
        if (this.regions[region]) {
          this.regions[region].dispose();
        }
        this.regions[region] = view;
      },

      showView : function(region) {
        var view = this.regions[region];

        if (view.fsm.can('render')) {
          view.setElement(region);
          view.defaultAction();
        } else
          if (view.fsm.can('show')) {
            view.show();
          }
          else {
            throw new Error('Hari UI: View ' + view.cid +
              ' is in a state that cannot be displayed: ' +
              view.fsm.current);
          }
      },

      /**
       */
      doRender : function() {
        this.$el.html(this.cachedTemplate(this.data));
        for (var view in this.regions) {
          this.showView(view);
        }
      },

      /**
       * Replaces a view's region with a new view
       * and applies a transition to the later
       * @param  {object} options configuration object. Has the following
       *                          attributes:
       *                          - region {string}
       *                          - newView {object}
       *                          - transition {string}
       * @return {object} return this
       */
      subViewTransition : function(options) {
        var region = options.region;
        var newView = options.newView;
        var viewPostRender = newView.fsm.onafterrender;

        //Add after render handler with the transition animation
        if (viewPostRender && _.isFunction(viewPostRender)) {
          newView.fsm.onafterrender = function() {
            viewPostRender.apply(newView);
            FXManager.animate(region, options.transition);
          };
        } else {
          newView.fsm.onafterrender = function() {
            FXManager.animate(region, options.transition);
          };
        }

        this.addView(region, newView);
        this.showView(region);

        return this;
      },

      /**
       */
      disposal : function() {
        BaseView.prototype.disposal.apply(this);
        for (var view in this.regions) {
          this.regions[view].dispose();
        }
      }
    });

    return ContainerView;
  }
);