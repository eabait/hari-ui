/**
 * Encapsulates all the logic necessary for DOM Animations
 */

define(
  [
    'jquery',
    'underscore',
    'transit',
    'modernizr'
  ],
  function($, _, transit, modernizr) {
    'use strict';

    var FxManager = {

      /**
       * Applies a CSS3 animation to a DOM element
       * @param  {string} region    region to be animated
       * @param  {string} animation animation to apply
       *                  list of animations:
       *                  https://github.com/daneden/animate.css
       */
      animate : function(region, animation) {
        var anim = 'animated ' + animation;
        var time = 1000; //this value depends on the animation ...

        if (modernizr.csstransforms3d) {
          region.addClass('3d');
        }

        $(region).children().addClass(anim);
        setTimeout(function() {
          $(region).children().removeClass(anim);
        }, time);
      },

      animateEl : function(el, animation, cb, tm) {
        var anim = 'animated ' + animation;
        if (modernizr.csstransforms3d) {
          el.addClass('3d');
        }

        el.addClass(anim);

        if (!_.isFunction(cb)) {
          return;
        }

        setTimeout(function() {
          cb();
        }, tm ? tm : 300);
      },

      translate : function(config) {
        var el = config.el;
        var toggle = config.toggle;

        el.transition({
          x: toggle ? 0 : config.left + 'px',
          y: toggle ? 0 : config.top + 'px',
          duration: config.duration || 800,
          easing: config.easing || 'in',
          complete: config.complete
        });
      },

      slide : function(config) {
        var el = config.el;
        el.transition({
          width: config.toggle ? 0 : '100%',
          duration: config.duration || 800,
          easing: config.easing || 'ease',
          complete: config.complete
        });
      },

      fade : function(config) {
        var el = config.el;
        el.transition({
            opacity: +!config.toggle,
            duration: config.duration || 800,
            easing: config.easing || 'ease',
            complete: config.complete
          });
      },

      makeToggable : function(animation, config) {
        var that = this;

        return {

          show: true,

          toggle: function() {
            var self = this;

            config = config || {};

            config.toggle = this.show;

            config.complete = function() {
              self.show = !self.show;
            };

            that[animation](config);
          }
        };
      }

    };

    return FxManager;
  }
);
