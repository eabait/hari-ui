/**
 * Cache Jasmine Spec
 *
 * @author Esteban S. Abait <estebanabait@gmail.com>
 */
define(
  [
    'cache'
  ],
  function(Cache) {
    'use strict';

    /**
     * Test creation of a cache object
     */
    describe('Cache initialization', function() {
      //
    });

    /**
     * Test adding new elements to the cache
     */
    describe('Cache add and get items', function() {
      var cache;

      beforeEach(function() {
        cache = new Cache({
          adapter: 'dom',
          name: 'test',
          fillFactor: 0.5,
          maxSize: 3
        });
      });

      afterEach(function() {
        cache.clear();
      });

      it('adds an object, and gets the same one', function() {
        var item1 = {
          name : 'test'
        };
        var item2;

        cache.setItem('test1', item1);
        item2 = cache.getItem('test1');

        expect(item1).toEqual(item2);
      });

      it('purge less accessed items', function() {
        var item1 = { id : 'a' };
        var item2 = { id : 'b' };
        var item3 = { id : 'c' };
        var item4 = { id : 'd' };

        runs(function() {
          cache.setItem('a', item1);
          cache.setItem('b', item2);
          cache.setItem('c', item3);

          cache.getItem('a');
          cache.setItem('d', item4);
        });

        waitsFor(function() {
          console.log(cache.size() === 2);
          return cache.size() === 2;
        }, 'wait for cache to be purged', 20);

        runs(function() {
          expect(cache.getItem('a')).toEqual(item1);
          expect(cache.getItem('b')).toBeNull();
          expect(cache.getItem('c')).toBeNull();
          expect(cache.getItem('d')).toEqual(item4);
        });
      });

      it('purge items with lower priority', function() {
        var item1 = { id : 'a' };
        var item2 = { id : 'b' };
        var item3 = { id : 'c' };
        var item4 = { id : 'd' };

        runs(function() {
          cache.setItem('a', item1, {priority: cache.LOW});
          cache.setItem('b', item2, {priority: cache.NORMAL});
          cache.setItem('c', item3, {priority: cache.NORMAL});
          cache.setItem('d', item4, {priority: cache.HIGH});
        });

        waitsFor(function() {
          console.log(cache.size() === 2);
          return cache.size() === 2;
        }, 'wait for cache to be purged', 5);

        runs(function() {
          expect(cache.getItem('a')).toBeNull();
          expect(cache.getItem('b')).toEqual(item2);
          expect(cache.getItem('c')).toBeNull();
          expect(cache.getItem('d')).toEqual(item4);
        });
      });

      it('purge items with less expiration slide', function() {
        var item1 = { id : 'a' };
        var item2 = { id : 'b' };
        var item3 = { id : 'c' };
        var item4 = { id : 'd' };
        var timeout = false;

        runs(function() {
          cache.setItem('a', item1, {expirationSliding: 1});
          cache.setItem('b', item2, {expirationSliding: 5});
          cache.setItem('c', item3, {expirationSliding: 1});

          //Wait for 1001 milliseconds to add another item
          setTimeout(function() {
            cache.setItem('d', item4, {expirationSliding: 5});
            timeout = true;
          }, 1001);
        });

        waitsFor(function() {
          return timeout;
        }, 'wait for cache to be purged', 5000);

        runs(function() {
          expect(cache.getItem('a')).toBeNull();
          expect(cache.getItem('b')).toEqual(item2);
          expect(cache.getItem('c')).toBeNull();
          expect(cache.getItem('d')).toEqual(item4);
        });
      });
    });

    /**
     * Test removing elements from the cache
     */
    describe('Cache remove items', function() {
      var cache;

      beforeEach(function() {
        cache = new Cache({
          adapter: 'dom',
          name: 'test',
          fillFactor: 0.5,
          maxSize: 3
        });
      });

      afterEach(function() {
        cache.clear();
      });

      it('add an object, remove it, and get it as null', function() {
        var item1 = {
          name : 'test'
        };
        var item2;

        cache.setItem('test1', item1);

        cache.removeByKey('test1');

        item2 = cache.getItem('test1');

        expect(item2).toBeNull();
      });

    });

  }
);

