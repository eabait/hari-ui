define(
  [
    'base.view',
    'text!./nav.tpl.html'
  ],
  function(BaseView, NavTpl) {
    'use strict';

    var NavView = BaseView.extend({

      panelStack : null, //ref to panel view container

      events : {
        'click .tab-nav li' : 'onNavClick'
      },

      doInit : function() {
        this.template = NavTpl;
        this.data = {
          id: this.cid,
          panels: this.options.panels
        };
        this.panelStack = this.options.panelStack;

        this.addPostTransition('render', this.onAfterRender, this);
      },

      onNavClick : function(e) {
        e.preventDefault();
        var navTab = $(e.currentTarget);
        var activeView = navTab.data('tabid');

        if (this.panelStack.active.cid !== activeView) {
          this.activeView = activeView;

          this.panelStack.showView(activeView);
          this.updateActiveHeader(activeView);
        }
      },

      updateActiveHeader : function(activeView) {
        this.$el.find('li').removeClass('active');
        this.$el.find('li[data-tabid="' + activeView + '"]').addClass('active');
      },

      onAfterRender : function() {
        this.$el.find('li[data-tabid="' + this.panelStack.active.cid + '"]').addClass('active');
      }
    });

    return NavView;
  }
);