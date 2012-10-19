/**
 * ToolBar View object
 *
 * @author  Juan Cruz Avellaneda <juan.avellaneda@globant.com>
 */

define(
  [
    'base.view',
    'jquery',
    'handlebars',
    'text!./toolbar.tpl.html'
  ],
  function(BaseView, $, Handlebars, template) {
    'use strict';

    var ToolbarView = BaseView.extend({

      initialize : function() {
        //save compiled template
        this.cachedTemplate = Handlebars.compile(template);
        //save compiled data for the template
        // (It should be done with a model, but it is still not defined...)
        this.refId = "#toolbarwrapper" + this.cid;
        this.options.data.id = this.refId;
        this.data = this.options.data;
      },

      doRender : function() {
        this.$el.html(this.cachedTemplate(this.data));
      }
    });

    return ToolbarView;
  }
);