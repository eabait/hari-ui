define(
  [
    'base.view',
    'text!./tweet.tpl.html'
  ],
  function(BaseView, tweetTpl) {
    'use strict';

    var TweetView = BaseView.extend({

      onshow: 'fade',
      onhide: 'fade',

      doInit : function() {
        this.template = tweetTpl;
      }

    });

    return TweetView;
  }
);