define(
  [
    'backbone'
  ],
  function(Backbone) {
    'use strict';

    var TweetCollection = Backbone.Collection.extend({

      url :'http://search.twitter.com/search.json?',

      query: '',

      fetch : function() {
        var options = {
          data : {
            q: this.query
          },
          crossDomain: true,
          dataType: 'jsonp'
        };
        return Backbone.Collection.prototype.fetch.call(this, options);
      },

      parse : function(response) {
        return response.results;
      }

    });

    return TweetCollection;
  }
);