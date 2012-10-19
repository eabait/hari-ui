/**
 * Collection of data rows object.
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

define(
  [
    'backbone',
    'underscore'
  ],
  function (Backbone, _) {
    'use strict';

    var RowCollection = Backbone.Collection.extend({

      /**
       * Overrides Backbone Model parse method.
       * Triggers change event
       *
       * @param  {object} res fetched data from endpoint
       */
      parse : function(res) {
        return res.rows;
      }
    });

    return RowCollection;
  }
);