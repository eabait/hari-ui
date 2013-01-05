define(
  [
    'container.view',
    'stacked.view',
    'text!./tab.tpl.html'
  ],
  function(ContainerView, StackedView, TabTpl) {
    'use strict';

    var TabView = ContainerView.extend({

      panelStack : null,

      events : {
        'click .tab-nav li' : 'onNavClick'
      },

      doInit : function() {
        this.template = TabTpl;
        this.data = {
          id: this.cid,
          panels: this.options.panels
        };

        this.panelStack = new StackedView();
        this.addView('.tab-panels', this.panelStack);

        var panels = this.data.panels;

        this.panelStack.addView(panels[0].view, true); //active panel
        for (var i = 1, l = panels.length; i < l; i++) {
          this.panelStack.addView(panels[i].view);
        }

        this.addPostTransition('render', this.onAfterRender, this);
      },

      onNavClick : function(e) {
        e.preventDefault();
        var navTab = $(e.currentTarget);
        var activeView = navTab.data('tabid');

        this.panelStack.showView(activeView);
        this.updateActiveHeader(activeView);
      },

      updateActiveHeader : function(activeView) {
        this.$el.find('li').removeClass('active');
        this.$el.find('li[data-tabid="' + activeView + '"]').addClass('active');
      },

      onAfterRender : function() {
        this.$el.find('li[data-tabid="' + this.panelStack.active.cid + '"]').addClass('active');
      }
    });

    return TabView;
  }
);