define(
  [
    'backbone',
    'container.view',
    'underscore'
  ],
  function(Backbone, ContainerView, _) {
    'use strict';

    var Module = function(options) {
      if (!options.router || !_.isObject(options.router)) {
        throw new Error('Hari UI: a router must be specified when creating a module');
      }
      this.router = options.router;

      this.viewManager = new ContainerView();
    };

    _.extend(Module.prototype, Backbone.Events, {

    });

    return Module;

  }
);