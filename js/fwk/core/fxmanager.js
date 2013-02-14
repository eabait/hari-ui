/**
 * Encapsulates all the logic necessary for DOM Animations
 *
 * TODO: not the best way to perform animations. We are assuming
 * browsers have CSS3 support here.
 *
 * In the future we need to explore alternatives such as:
 *  - https://github.com/louisremi/jquery.transition.js/
 *  - https://github.com/louisremi/jquery.transform.js
 *  - https://github.com/rstacruz/jquery.transit
 *  - https://github.com/visionmedia/move.js
 *  - https://github.com/benbarnett/jQuery-Animate-Enhanced
 */

define(
  [
    'jquery',
    'underscore',
    'transit'
  ],
  function($, _, transit) {
    'use strict';

    var FXManager = {

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
        //TODO - change this mechanism for the Enhaced Animate Plugin

        $(region).children().addClass(anim);
        setTimeout(function() {
          $(region).children().removeClass(anim);
        }, time);
      },

      animateEl : function(el, animation, cb, tm) {
        var anim = 'animated ' + animation;
        el.addClass(anim);

        if (!_.isFunction(cb)) {
          return;
        }

        setTimeout(function() {
          cb();
        }, tm ? tm : 300);
      },

      /**
       * Use to apply slide left or top animation during
       * DOM content replacement
       *
       * A configuration object must be provided with the following
       * attributes:
       *  {object}    el       jQuery DOM element
       *  {number}    duration duration of the animation
       *  {number}    left     horizontal translation in pixels
       *  {number}    top      vertical translation in pixels
       *  {function}  cb       callback, usually a view render function
       *
       * @param  {object} config configuration object
       */
      slideContent : function(config) {
        var el = config.el;
        var duration = config.duration;

        el.transition({x: config.left + 'px', y: config.top + 'px' });

        setTimeout(function() {
          var context = config.context;
          config.cb.apply(context);
          el.css('opacity', 0);
          el.transition({x: '-' + config.left + 'px', y: '-' + config.top + 'px' });

          setTimeout(function() {
            el.css('opacity', 1);
            el.transition({x: '0px', y: '0px' });
          }, duration);

        }, duration);
      }

    };

    return FXManager;
  }
);
