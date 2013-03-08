define(
  [
    'base.view'
  ],
  function(BaseView) {
    'use strict';

    var TweetView = BaseView.extend({

      animation: 'fade',

      doInit : function() {
        this.template = 'tweet.tpl.html';
      }

    });

    return TweetView;
  }
);