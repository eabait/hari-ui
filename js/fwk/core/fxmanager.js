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
    'underscore'
  ],
  function($, _) {
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
       * There are better ways to handle browser prefixes...
       * This must be refactored if going to production
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

        el.css({'-moz-transition': '-moz-transform ease-in-out ' + duration + 'ms'});
        el.css({'-webkit-transition': '-webkit-transform ease-in-out ' + duration + 'ms'});
        //el.css({'-o-transition': '-moz-transform ease-in-out ' + duration + 'ms'});
        //el.css({'transition': '-moz-transform ease-in-out ' + duration + 'ms'});

        el.css({'-moz-transform':  'translate(' + config.left + 'px, ' + config.top + 'px)'});
        el.css({'-webkit-transform':  'translate(' + config.left + 'px, ' + config.top + 'px)'});
        //el.css({'-o-transform':  'translate(' + config.left + 'px, ' + config.top + 'px)'});
        //el.css({'transform':  'translate(' + config.left + 'px, ' + config.top + 'px)'});

        setTimeout(function() {
          var context = config.context;
          config.cb.apply(context);
          el.css('opacity', 0);
          el.css({'-moz-transform':  'translate(-' + config.left + 'px, -' + config.top + 'px)'});
          el.css({'-webkit-transform':  'translate(-' + config.left + 'px, -' + config.top + 'px)'});
          //el.css({'-o-transform':  'translate(-' + config.left + 'px, -' + config.top + 'px)'});
          //el.css({'transform':  'translate(-' + config.left + 'px, -' + config.top + 'px)'});

          setTimeout(function() {
            el.css('opacity', 1);
            el.css({'-moz-transform': 'translate(0, 0)'});
            el.css({'-webkit-transform': 'translate(0, 0)'});
            //el.css({'-o-transform': 'translate(0, 0)'});
            //el.css({'transform': 'translate(0, 0)'});
          }, duration);

        }, duration);
      }

    };

    return FXManager;
  }
);