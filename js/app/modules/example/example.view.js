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
        {name: 'Static text', view: new BaseView({template: '<div>First tab displays a view with static text</div>'})},
        {name: 'Static view', view: new BaseView({template: '<div>First tab displays a view with static text</div>'})},
        {name: 'Static view', view: new BaseView({template: '<div>First tab displays a view with static text</div>'})},
        {name: 'Tweet search', view: new TweetSearchWidget()}
      ]
    });

    example.addView('.tab-widget', tab);
    example.addView('.static-view', new BaseView({
      template: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sagittis ' +
      'sodales luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ' +
      'cursus porta cursus. Curabitur imperdiet mauris id arcu pharetra facilisis. Lorem ipsum' +
      ' dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur ' +
      'adipiscing elit. Pellentesque tellus justo, vulputate a laoreet nec, sodales eu turpis. ' +
      'Pellentesque viverra consectetur luctus. Quisque mi lacus, sollicitudin non hendrerit interdum,' +
      'fringilla in magna. Nulla accumsan iaculis rhoncus. Maecenas et sollicitudin nisi. Etiam ut' +
      ' mauris elit. Maecenas sodales posuere nulla, lacinia lobortis nibh cursus at. Quisque dapibus,' +
      ' arcu id tempus sodales, odio tortor sodales sapien, eget facilisis nibh ante sit amet elit.' +
      ' Donec ut ipsum ac turpis varius vulputate. Vestibulum massa nisl, vulputate et malesuada ' +
      'eget, luctus in est.'
    }));

    return example;
  }
);