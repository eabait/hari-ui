/**
 * Breadcrumb model object.
 * Contains breadcrumb data, and provides methods for accessing it, and
 * mutating it.
 *
 * @author  Juan Cruz Avellaneda <juan.avellaneda@globant.com>
 */

define(
  [
    'backbone',
    'jquery',
    'underscore'
  ],
  function (Backbone, $, _) {
    'use strict';

    var BreadcrumbModel = Backbone.Model.extend({

      initialize : function() {
        this.stack = [];
        this.root = null;
      },

      addNavigationElement : function(e) {
        var target = e.data;

        e.name = e.name ? e.name : e.to;

        if ((this.root && this.root.to === e.to) ||
          this.getNavigationElement(e.to)) {
          return;
        }
        if (target && target.node !== 'Leaf') {
          if (this.root && this.root.data.node !== 'Leaf') {
            this.stack.push(this.root);
          }
          this.root = e;
          this.trigger('change');
        }
        else {
          if (target && target.node === 'Leaf') {
            if (this.root && this.root.data.node !=='Leaf') {
              this.stack.push(this.root);
            }
              this.root = e;
              this.trigger('change');
          }
        }
      },

      addExternalNavigationElement : function(e) {
        e.type = 'external';
        this.addNavigationElement(e);
      },

      /**
       * Remove stack tail elements from the
       * specified item position
       * @param  {object} item an object instance
       */
      removeTail : function(item) {
        var pos = -1;
        for (var i = 0, l = this.stack.length; i < l; ++i) {
          if (this.stack[i].to === item.to) {
            pos = i;
          }
        }
        if (i !== -1) {
          this.root = item;
          this.stack = pos ? _.initial(this.stack, pos) : [];
          this.trigger('change');
        }
      },

      /**
       * Returns to the previous menu state.
       * Triggers change event.
       */
      goBack : function() {
        if (this.root && this.root.type === 'external') {
          return;
        }
        if (this.root && this.root.data.node ==='Leaf') {
          this.root = this.stack.pop();
        }
        this.root = this.stack.pop();
        this.trigger('change');
      },

      /**
       *  ACCESSOR METHODS
       */
      getNavigationElement : function(name) {
        return _.find(this.stack, function(e) {
          return e.to === name;
        });
      },

      getPath : function() {
        return this.stack;
      },

      getActive : function() {
        if (!this.root) {
          return '';
        }
        return this.root;
      },

      rebootTail : function(e){
        this.stack = [];
        this.root = null;
        this.trigger('change');
      },

      getHome : function(){
        return this.stack[0];
      }

    });

    return new BreadcrumbModel();
  }
);