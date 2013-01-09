define(
  [
    'base.view',
    'pubsub',
    'text!./search.tpl.html'
  ],
  function(BaseView, PubSub, searchTpl) {
    'use strict';

    var SearchView = BaseView.extend({

      events : {
        'keypress input' : 'onKeyPress'
      },

      doInit : function() {
        this.template = searchTpl;
      },

      onKeyPress : function(e) {
        if (e.which === 13) {
          var data = this.$el.find('input').val();
          PubSub.publish('tweetsearch.search', data);
        }
      }

    });

    return SearchView;
  }
);