define(
  [
    'container.view',
    './nav.view',
    'stacked.view'
  ],
  function(ContainerView, NavView, StackedView) {
    'use strict';

    var TabView = ContainerView.extend({

      panelStack : null,
      navView : null,

      doInit : function() {
        this.template = 'tab.tpl.html';
        this.data = {
          id: this.cid
        };

        //Add view container for the tab-panels
        this.panelStack = new StackedView({
          template: '<div id="{{id}}"></div>' //wrapper template
        });
        this.addView('.tab-panels', this.panelStack);

        //Add view for the tab navigation menu
        this.navView = new NavView({
          panels: this.options.panels,
          panelStack : this.panelStack
        });
        this.addView('.tab-nav', this.navView);

        //Add panels to StackedView container
        var panels = this.options.panels;
        this.panelStack.addView(panels[0].view, true); //active panel
        for (var i = 1, l = panels.length; i < l; i++) {
          this.panelStack.addView(panels[i].view);
        }
      }
    });

    return TabView;
  }
);