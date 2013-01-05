define(
  [
    'base.view',
    'container.view',
    'fwk/widgets/tab/tab.widget',
    'text!./example.tpl.html'
  ],
  function(BaseView, ContainerView, TabWidget, tpl) {
    'use strict';

    var example = new ContainerView({
      template: tpl
    });

    var tab = new TabWidget({
      onshow : 'fade',
      onhide : 'fade',
      panels: [
        {name: 'Tab1', view: new BaseView({template: '<div>Tab widget example</div>'})},
        {name: 'Tab2', view: new BaseView({template: '<div>Table widget example</div>'})},
        {name: 'Tab3', view: new BaseView({template: '<div>Load twitter widget example</div>'})}
      ]
    });

    example.addView('.tab-widget', tab);

    return example;
  }
);