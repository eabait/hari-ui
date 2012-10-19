/**
 * NotificationsView object
 *
 * @author  Juan Cruz Avellaneda <juan.avellaneda@globant.com>
 */

define(
  [
    'base.view',
    'jquery',
    'handlebars',
    'underscore',
    'fwk/core/fxmanager',
    'text!./popover.tpl.html'
  ],
  function(BaseView, $, Handlebars, _, FXManager, template) {
    'use strict';

    var PopoverView = BaseView.extend({

      activationZone : null,

      //Default animations
      onshow: 'slide',
      onhide: 'slide',

      initialize : function() {
        this.temp = Handlebars.compile(template);
        this.data = this.options.data;
        this.data.menuType = this.data.type === 'Menu' ? true : false;
        this.data.notificationsType = this.data.type === 'Notifications' ? true : false;

        $(document).click(_.bind(this.hideNotifications,this));
        this.setActivationZone();
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
       * Set the activation zone which is the DOM element
       * that will make the notifications visible
       * @param  {string} actZone contains the activation
       *                          zone element's class
       */

      setActivationZone : function() {
        this.activationZone = this.options.activationZone;
        this.activationZone.click(_.bind(this.handleState, this));
      },

      doRender : function() {
        this.$el.html(this.temp(this.data));
        //apply configured animation
        FXManager.animate(this.$el, 'fadeInUp');
        //add events to the inner menu action
        $('.inner-menu-activation-zone').hover(_.bind(this.showInnerMenu,this));
        $('.inner-menu-deactivation-zone').hover(_.bind(this.hideInnerMenu,this));
        $('.main-container').hover(_.bind(this.hideInnerMenu,this));
        $('body').hover(_.bind(this.hideInnerMenu,this));
      },

      showInnerMenu : function() {
        $('.inner-menu').removeClass('ui-helper-hidden');
      },

      /**
       * Hides the notifications when the user clicks outside
       * @param  {object} e jquery event object
       */

      hideNotifications : function(e) {
        if (e) {
          var actZone = this.activationZone;
          var container = this.$el;

          var allowedToHide = this.is('displayed') &&
              actZone.has(e.target).length === 0 &&
              container.has(e.target).length === 0 &&
              e.target !== actZone[0];

          if (allowedToHide) {
            this.hide();
            $('.inner-menu').addClass('ui-helper-hidden');
          }
        }
      },

      hideInnerMenu : function(e) {
        $('.inner-menu').addClass('ui-helper-hidden');
      }
    });

    return PopoverView;
  }
);