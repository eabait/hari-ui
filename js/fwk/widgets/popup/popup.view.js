/**
 *  Generic popup window.
 *  Usage:
 *  <pre>
 *  new PopupView({
 *
 *    //Popup window header
 *    caption: 'Dialog',
 *
 *    //DOM element to hold the popup window
 *    //optional parameter
 *    targetEl: '.drilldown-actions-cog',
 *
 *    //items hash {'item name' : 'item handler'}
 *    items: {
 *      'Item1' : function() {
 *         console.log('Item 1!');
 *      },
 *      'Item2' : function() {
 *        console.log('Item 2');
 *      }
 *    },
 *
 *    //animation property
 *    animation: 'fade' //['fade', 'slide']
 *  });
 *  </pre>
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

 define(
  [
    'base.view',
    'pubsub',
    'jquery',
    'underscore',
    'handlebars',
    'text!./popup.tpl.html'
  ],
  function(BaseView, PubSub, $, _, Handlebars, popupTpl) {
    'use strict';

    var PopupView = BaseView.extend({

      name: 'PopupView',

      //element associated to popup window
      targetEl : null,

      //cached reference to the DOM element that holds the popup
      $targetEl : null,

      //cached reference to the DOM element popup
      $popup : null,

      itemHash : null,

      caption : null,

      context : null,

      initialize: function() {
        //save compiled template
        this.cachedTemplate = Handlebars.compile(popupTpl);

        this.itemHash = this.options.items;
        this.caption = this.options.caption;
        this.context = this.options.context;
      },

      /**
       * Overwrites Backbone's View setElement, which basically
       * apply a Backbone view to a different DOM element.
       *
       * We need to override because we are changing the way elements
       * are created and events are attached (eabait)
       *
       * @param  {object} targetEl new DOM element to hold the popup window
       */
      setElement : function(targetEl) {
        if (this.$el) {
          this.undelegateEvents();
          $(document).off('mouseup');
        }
        //save references to DOM target element and parent
        this.targetEl = targetEl;
        this.$targetEl = $(targetEl);
        this.$el = $(this.targetEl).parent();
        //setup event delegation
        this.setUpEventHandling();
      },

      /**
       * Setup all event handling for the widget.
       * Uses Backbone View's delegateEvent method
       * for attaching events
       */
      setUpEventHandling : function() {
        var events = {};
        events['click ' + this.targetEl] = 'handleState';
        events['click' + ' a'] = 'onClickItems';
        //events['mouseup document'] = 'onClickDocument';
        this.delegateEvents(events);

        //until figure out how to do it through Backbone
        //delegateEvents (eabait)
        $(document).mouseup(_.bind(this.onClickDocument, this));
      },

      /**
       * Applies the correct state transition according
       * current state and event
       * @param  {object} e jquery event object
       */
      handleState : function(e) {
        e.stopPropagation();
        switch (this.fsm.current) {
          case 'start':
            this.render();
            break;
          case 'invisible':
            this.show();
            break;
          default:
            this.hide();
        }
      },

      /**
       * Renders the popup. Change state to 'active'.
       * Saves popup DOM element into <pre>$popup</pre>
       */
      doRender : function() {
        var dialog,
            containerPosition,
            items = this.itemHash,
            events = {};

        for (var i=0; i<items.length; i++) {
          items[i].itemId = i;
        }

        //generate element html and append to parent element
        dialog = this.cachedTemplate({
          id : this.cid,
          items : items,
          caption: this.caption
        });
        this.$el.append(dialog);

        //save reference to created popup element
        this.$popup = $('#' + this.cid);

        //update popup position relative to targetEl
        containerPosition =  this.$targetEl.position();
        this.$popup.css({
          top: containerPosition.top + this.$targetEl.height(),
          left: containerPosition.left + this.$targetEl.width()
        });

        //apply configured animation
        this.showAnimation();
      },

      /**
       * Handles click event on popup window
       * items. Call corresponding function on
       * the specified items hash
       *
       * @param  {object} e jQuery event object
       */
      onClickItems : function(e) {
        var clicked,
            handler,
            context;

        e.preventDefault();
        clicked = $(e.target).attr('data-ppitem-order');

        if (this.itemHash) {
          handler = this.itemHash[clicked].event;

          if (handler) {
            context = this.context;

            //setTimeout(, 300);
            this.hide(function() {
              handler.call(context || this, e);
            });
          }
          else {
            throw new Error('Error Skywalker UI: there is no callback' +
              ' for the clicked popup item : ' + clicked);
          }
        }
      },

      /**
       * Hides popup window if user click outside it.
       *
       * @param  {object} e jQuery event object
       */
      onClickDocument : function(e) {
        var container = this.$el;
        var isVisible = this.fsm.is('visible') || this.fsm.is('displayed');

        if (isVisible &&
            container.has(e.target).length === 0) {
          this.hide();
        }
      },

      /**
       * Applies the correct animation. Animation is
       * specified when creating the widget
       */
      showAnimation : function() {
        this.animations['show'][this.options.onshow].apply(this.$popup);
      },

      hideAnimation : function() {
        this.animations['hide'][this.options.onshow].apply(this.$popup);
      },

      /**
       * Free used resources by this view object
       */
      cleanUp : function() {
        BaseView.prototype.cleanUp.apply(this);
        for (var item in this.itemHash) {
          for (var prop in item) {
            if (item.hasOwnProperty(prop)) {
              delete this.itemHash[prop];
            }
          }
        }
        delete this.itemHash;
        delete this.caption;
        delete this.targetEl;
        delete this.$targetEl;
        delete this.$popup;
        delete this.context;
      }

    });

  return PopupView;
});