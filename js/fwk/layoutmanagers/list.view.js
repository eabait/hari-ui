/**
 * ListView
 * @extends from BaseView
 *
 * Renders a list of Views iterating through a Collection.
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

define(
  [
    'base.view'
  ],
  function(BaseView) {
    'use strict';

    var ListView = BaseView.extend({

      name: 'ListView',

      items: [],

      constructor: function() {
        ListView.__super__.constructor.apply(this, arguments);
        this.model.on('reset', this.render, this);
        // this.model.on('add', this.updateView, this);

        if (!this.options.itemView) {
          throw new Error('Hari UI: an ItemView constructor function must be provided');
        }

        this.ItemViewConstructor = this.options.itemView;

        this.addPreTransition('load', function() {
          this.$el.html('<p>Loading...</p>'); //removed on doRender
        }, this);
      },

      defaultAction : function() {
        this.load();
      },

      doLoad : function() {
        return this.model.fetch();
      },

      /**
       */
      doRender : function() {
        var itemView;
        var item;
        var that = this;

        this.$el.empty();

        this.model.each(function(m) {
          itemView = new that.ItemViewConstructor({
            model: m
          });
          that.items.push(itemView);

          item = $(that.cachedTemplate()).appendTo(that.$el);
          itemView.setElement(item);
          itemView.render();
        });
      },

      /**
       */
      disposal : function() {
        BaseView.prototype.disposal.apply(this);
        for (var i = 0, l = this.items.length; i < l; i++) {
          this.items[i].dispose();
        }
        delete this.items;
      }
    });

    return ListView;
  }
);