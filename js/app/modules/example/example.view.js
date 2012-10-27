define(
  [
    'base.view',
    'text!./example.tpl.html'
  ],
  function(BaseView, tpl) {
    'use strict';

    var ExampleView = BaseView.extend({

      el: 'body',

      initialize : function() {
        this.template = tpl;
      },

      doRender : function() {
        this.$el.append(this.cachedTemplate);
      }

    });

    return ExampleView;
  }
);