define(
  [
    'base.view',
    'pubsub'
  ],
  function(BaseView, PubSub) {
    'use strict';

    var SearchView = BaseView.extend({

      events : {
        'keypress input' : 'onKeyPress'
      },

      doInit : function() {
        this.template = 'search.tpl.html';
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