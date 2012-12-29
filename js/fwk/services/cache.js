/**
 * LRU Cache implementation
 * Implementation based on JS Cache: https://github.com/monsur/jscache
 * Modified to use lawnchair as a storage system.
 *
 * API:
 *   setItem
 *   getItem
 *   clear
 *   size
 *
 * @author Esteban S. Abait <estebanabait@gmail.com>
 */
define(
  [
    'lawnchair'
  ],
  function(Lawnchair) {
    'use strict';

    /**
     * @Constructor
     * @param {object} options
     */
    function Cache(options) {
      var that = this;
      this.cache = new Lawnchair({
        adapter : options.adapter || 'memory',
        table : 'data.cache.' + options.name
      }, function() {
        that.maxSize = options.maxSize || -1;
        that.fillFactor = options.fillFactor || 0.75;
        that.defaultSliding = options.defaultSliding || 60;

        that.stats = {};
        that.stats['hits'] = 0;
        that.stats['misses'] = 0;
      });
    }

    //Cache element's priorities
    Cache.prototype.LOW = 1;
    Cache.prototype.NORMAL = 2;
    Cache.prototype.HIGH = 4;

    /**
     * Retrieves an item from the cache.
     * @param {string} key The key to retrieve.
     * @return {Object} The item, or null if it doesn't exist.
     */
    Cache.prototype.getItem = function(key) {
      var returnVal;
      var that = this;
      // retrieve the item from the cache
      this.cache.get(key, function(v) {

        if (!v) {
          that.stats['misses']++;
          returnVal = null;
          return;
        }

        if (!that.isExpired(v.item)) {
          // if the item is not expired
          // update its last accessed date
          v.item.lastAccessed = new Date().getTime();
        } else {
          // if the item is expired, remove it from the cache
          that.removeItem(v);
          v = null;
        }

        // return the item value (if it exists), or null
        returnVal = v ? v.item.value : null;
        if (returnVal) {
          that.stats['hits']++;
          //console.log('Cache HIT for key ' + key);
        } else {
          that.stats['misses']++;
          //console.log('Cache MISS for key ' + key);
        }
      });

      return returnVal;
    };

    /**
     * Constructor function for stored objects in cache
     * @param  {string} k Element's key
     * @param  {string} v Element's value
     * @param  {[type]} o [description]
     * @return {[type]}   [description]
     */
    Cache.CacheItem = function(k, v, o) {
      if (!k) {
        throw new Error("key cannot be null or empty");
      }
      this.key = k;
      this.value = v;
      o = o || {};
      if (!o.priority) {
        o.priority = this.NORMAL;
      }
      this.options = o;
      this.lastAccessed = new Date().getTime();
    };

    /**
     * Sets an item in the cache.
     * @param {string} key The key to refer to the item.
     * @param {Object} value The item to cache.
     * @param {Object} opt an optional object which controls various caching
     *    opt:
     *      expirationSliding: an integer representing the seconds since
     *                         the last cache access after which the item
     *                         should expire
     *      priority: How important it is to leave this item in the cache.
     *                You can use the values CachePriority.LOW, .NORMAL, or
     *                .HIGH, or you can just use an integer.  Note that
     *                placing a priority on an item does not guarantee
     *                it will remain in cache.  It can still be purged if
     *                an expiration is hit, or if the cache is full.
     *      callback: A function that gets called when the item is purged
     *                from cache.  The key and value of the removed item
     *                are passed as parameters to the callback function.
     */
    Cache.prototype.setItem = function(key, value, opt) {
      var that = this;

      var options = opt || {};

      options.expirationSliding = options.expirationSliding || this.defaultSliding;

      // add a new cache item to the cache
      this.cache.get(key, function(key) {
        if (key) {
          that.removeItem(key);
        }
      });
      this.addItem(new Cache.CacheItem(key, value, options));
      //console.log('Setting key ' + key);

      // if the cache is full, purge it
      if ((this.maxSize > 0) && (this.size() > this.maxSize)) {
        setTimeout(function() {
          that.purge.call(that);
        }, 0);
      }
    };

    /**
     * Removes all items from the cache.
     */
    Cache.prototype.clear = function() {
      // loop through each item in the cache and remove it
      this.cache.nuke('console.log("Cache cleared")');
    };

    /**
     * @return {Object} The hits and misses on the cache.
     */
    Cache.prototype.getStats = function() {
      return this.stats;
    };

    /**
     * Allows it to resize the Cache capacity if needed.
     * @param {integer} newMaxSize the new max amount of stored entries within the Cache
     */
    Cache.prototype.resize = function(newMaxSize) {
      console.log('Resizing Cache from ' + this.maxSize + ' to ' + newMaxSize);
      // Set new size before purging so we know how many items to purge
      var oldMaxSize = this.maxSize;
      this.maxSize = newMaxSize;

      if (newMaxSize > 0 && (oldMaxSize < 0 || newMaxSize < oldMaxSize)) {
        if (this.size() > newMaxSize) {
          // Cache needs to be purged as it does contain too much entries for the new size
          this.purge();
        } // else if cache isn't filled up to the new limit nothing is to do
      }
      // else if newMaxSize >= maxSize nothing to do
      //console.log('Resizing done');
    };

    /**
     * Removes expired items from the cache.
     */
    Cache.prototype.purge = function() {
      var tmparray = [];
      var purgeSize = Math.round(this.maxSize * this.fillFactor);
      var that = this;

      if (this.maxSize < 0) {
        purgeSize = this.size() * this.fillFactor;
      }

      // loop through the cache, expire items that should be expired
      // otherwise, add the item to an array
      this.cache.each(function(obj) {
        if (that.isExpired(obj.item)) {
          that.removeItem(obj);
        } else {
          tmparray.push(obj);
        }
      });

      if (tmparray.length > purgeSize) {
        // sort this array based on cache priority and the last accessed date
        tmparray = tmparray.sort(function(elem1, elem2) {
          var a = elem1.item;
          var b = elem2.item;
          if (a.options.priority !== b.options.priority) {
            return b.options.priority - a.options.priority;
          } else {
            return b.lastAccessed - a.lastAccessed;
          }
        });
        // remove items from the end of the array
        while (tmparray.length > purgeSize) {
          var ritem = tmparray.pop();
          this.removeItem(ritem);
        }
      }
      //console.log('Purged cached');
    };


    /**
     * Add an item to the cache.
     * @param {Object} item The cache item to add.
     * @private
     */
    Cache.prototype.addItem = function(item, attemptedAlready) {
      //var that = this;
      try {
        this.cache.save({
          key : item.key,
          item : item
        });
      } catch(err) {
        if (attemptedAlready) {
          //console.log('Failed setting again, giving up: ' + err.toString());
          throw(err);
        }
        //console.log('Error adding item, purging and trying again: ' + err.toString());
        this.purge();
        this.addItem(item, true);
      }
    };

    /**
     * Remove an item from the cache, call the callback function (if it exists).
     * @param {String} key The key of the item to remove
     * @private
     */
    Cache.prototype.removeByKey = function(key) {
      var that = this;
      this.cache.get(key, function(item) {
        that.removeItem(item);
      });
    };


    /**
     * Remove an item from the cache, call the callback function (if it exists).
     * @param {object} elem CacheItem instance to be removed
     * @private
     */
    Cache.prototype.removeItem = function(elem) {
      var item = elem.item;
      this.cache.remove(elem.key, function() {
        // if there is a callback function, call it at the end of execution
        if (item && item.options && item.options.callback) {
          setTimeout(function() {
            item.options.callback.call(null, item.key, item.value);
          }, 0);
        }
        return item ? item.value : null;
      });
    };

    Cache.prototype.size = function() {
      var size = 0;
      this.cache.all(function(items) {
        size = items.length;
      });
      return size;
    };

    /**
     * @param {Object} item A cache item.
     * @return {boolean} True if the item is expired
     * @private
     */
    Cache.prototype.isExpired = function(item) {
      var now = new Date().getTime();
      var expired = false;

      // if the sliding expiration has passed, expire the item
      var lastAccess =
        item.lastAccessed + (item.options.expirationSliding * 1000);

      return (lastAccess < now);
    };

    return Cache;
  }
);