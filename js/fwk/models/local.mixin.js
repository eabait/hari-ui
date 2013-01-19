/**
 * Mix this object to turn any Backbone's Model or Collection
 * into a model that can be saved in the browser.
 * Uses Lawnchair as a storage mechanism.
 *
 * Usage:
 * //Using models
 * var Config = Backbone.Model.extend(LocalMixin, {localName: 'config'});
 * var cfg = new Config();
 * cfg.set('key', '123-345-567');
 * cfg.set('locale', 'es');
 * cfg.save();
 *
 * NOTE: There are still issues. Not fully compatible with Backbone persistence
 * mechanism. Backbone.Collection.sync fails.
 */
define(
  [
    'underscore',
    'jquery',
    'backbone',
    'lawnchair'
  ],
  function(_, $, Backbone, Lawnchair) {
    'use strict';

    var LocalModel = {

      //Lawnchair adapter
      //dom indicates lawnchair to use localStorage
      adapter : 'dom',

      sync : function(method, model, options) {

        //let create a deferred object to comply with
        //the expected interface (return a promise)
        var deferred = $.Deferred();

        //If store haven't been mixed or created, then default to
        //this one
        this.store = this.store || new Lawnchair({
          name: 'localmodel-' + this.localName, //uses class-attributes
          adapter: this.adapter
        }, function() {});

        var callback = function(record) {

          if (record == null) {
            options.error('Record not found');
            deferred.reject({
              error: 'Record not found'
            });
            return;
          }

          var keyToId = function(obj) {
            obj.id = model.id || obj.key;   // workaround for Lawnchair issue #57
            delete obj.key;
          };

          if (_.isArray(record)) {
            _.each(record, keyToId);
          } else {
            keyToId(record);
          }

          options.success(record);
          deferred.resolve(record);
        };

        var json = model.toJSON();
        json.key = model.id;
        delete json.id;

        switch (method) {
          case 'read':
            json.key ? this.store.get(json.key, callback) : this.store.all(callback);
            break;
          case 'create':
            this.store.save(json, callback);
            break;
          case 'update':
            this.store.save(json, callback);
            break;
          case 'delete':
            this.store.remove(json.key, options.success);
            break;
        }

        return deferred.promise();
      }
    };

    return LocalModel;
  }
);