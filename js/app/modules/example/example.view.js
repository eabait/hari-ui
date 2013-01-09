define(
  [
    'base.view',
    'container.view',
    'fwk/widgets/tab/tab.widget',
    'fwk/widgets/tweetsearch/tweetsearch.widget',
    'text!./example.tpl.html'
  ],
  function(BaseView, ContainerView, TabWidget, TweetSearchWidget, tpl) {
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
        {name: 'Twitter', view: new TweetSearchWidget()}
      ]
    });

    example.addView('.tab-widget', tab);

    return example;
  }
);