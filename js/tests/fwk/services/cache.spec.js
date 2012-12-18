/**
 * BaseView Jasmine Spec
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
     * Test creation of a view
     */
    describe('intialization', function() {
      it('throws an exception if no options are passed', function() {
        //Extend BaseView without specifing a template
        var cache = new Cache({
          adapter: 'dom',
          name: 'test',
          fillFactor: 0.5,
          maxSize: 100
        });
        cache.setItem(
          'test1',
          {
            test: 'test'
          },
          {
            expirationAbsolute: null,
            expirationSliding: 60,
            priority: cache.HIGH,
            callback: function(k, v) { console.log('removed ' + k); }
          }
        );
        var item = cache.getItem('test1');
        alert(item.test);
      });
    });

  }
);

