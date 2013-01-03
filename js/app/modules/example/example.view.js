define(
  [
    'base.view',
    'text!./example.tpl.html'
  ],
  function(BaseView, tpl) {
    'use strict';

    var example = new BaseView({
      template: tpl
    });

    return example;
  }
);