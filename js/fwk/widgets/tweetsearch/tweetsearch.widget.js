define(
  [
    'underscore',
    'container.view',
    'list.view',
    './search.view',
    './tweet.view',
    './tweet.collection',
    'text!./tweetsearch.tpl.html'
  ],
  function(_, ContainerView, ListView, SearchView, TweetView, TweetCollection, tweetSearchTpl) {
    'use strict';

    var TweetSearchWidget = ContainerView.extend({

      doInit : function() {
        var searchView;
        var listView;

        this.template = tweetSearchTpl;
        this.data = {
          id : this.cid
        };

        this.model = new TweetCollection();

        searchView = new SearchView({
          model: this.model
        });

        listView = new ListView({
          template: '<li></li>',
          itemView: TweetView,
          model: this.model
        });

        listView.subscribe('tweetsearch.search', function(ev, q) {
          listView.model.query = q;
          listView.load();
        });

        this.addView('.tweet-search', searchView);
        this.addView('.tweet-list', listView);
      }

    });

    return TweetSearchWidget;
  }
);