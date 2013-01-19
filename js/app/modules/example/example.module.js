define(
  [
    'base.module',
    'base.view',
    'container.view',
    'fwk/widgets/tab/tab.widget',
    'fwk/widgets/tweetsearch/tweetsearch.widget',
    'underscore',
    'backbone',
    'fwk/models/local.mixin',
    'text!./example.tpl.html'
  ],
  function(BaseModule, BaseView, ContainerView, TabWidget, TweetSearchWidget, _, Backbone, LocalMixin, tpl) {
    'use strict';

    //1) Create a container instance to act as a view manager
    var exampleViewManager = new ContainerView({
      template: tpl
    });

    //2) Create view or widget instances
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

    //3) Add view or widget instances to view manager
    exampleViewManager.addView('.tab-widget', tab);
    exampleViewManager.addView('.static-view', new BaseView({
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

    //TESTING LOCAL MIXIN---------------------------------------------------------------------------------
    var Person = Backbone.Model.extend(LocalMixin, {localName: 'persons'});
    var Persons = Backbone.Collection.extend({
      model: Person
    });
    var personList = new Persons();

    _.extend(personList, LocalMixin, {localName: 'persons'});

    personList.create({name: 'Esteban', age: '29'});
    personList.create({name: 'Ana', age: '25'});
    personList.create({name: 'Jane', age: '19'});
    personList.create({name: 'Ernst', age: '60'});

    var Config = Backbone.Model.extend({});
    var cfg = new Config();

    _.extend(cfg, LocalMixin, {localName: 'config'});

    cfg.set('auth-key', '123-345-567');
    cfg.set('locale', 'es');
    cfg.save();

    //----------------------------------------------------------------------------------------------------

    //4) Return a new Module instance with the created view manager instance
    return new BaseModule({
      viewManager : exampleViewManager
    });
  }
);