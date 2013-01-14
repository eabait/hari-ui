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
    'underscore',
    'base.view',
    'fwk/core/fxmanager'
  ],
  function(_, BaseView, FXManager) {
    'use strict';

    var ContainerView = BaseView.extend({

      name: 'ContainerView',

      constructor: function() {
        this.regions = {};
        ContainerView.__super__.constructor.apply(this, arguments);
      },

      addView : function(region, view) {
        if (this.regions[region]) {
          this.regions[region].dispose();
        }
        this.regions[region] = view;
        view.el = region;
      },

      showView : function(region) {
        var view = this.regions[region];

        if (view.can('render')) {
          view.setElement(region);
          view.defaultAction();
        } else
          if (view.can('show')) {
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
          newView.addPostTransition('render', function() {
            viewPostRender.apply(newView);
            FXManager.animate(region, options.transition);
          });
        } else {
          newView.addPostTransition('render', function() {
            FXManager.animate(region, options.transition);
          });
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