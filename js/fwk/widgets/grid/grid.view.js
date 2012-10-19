/**
 * Grid View object based on jQuery's plugin: jqGrid <http://www.trirand.com/blog/>
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

 define(
  [
    'base.view',
    'jquery',
    'underscore',
    'jqGrid',
    './row.collection'
  ],
  function(BaseView, $, _, jqGrid, RowCollection) {
    'use strict';

    var GridView = BaseView.extend({

      name: 'GridView',

      initialize : function() {
        this.model = new RowCollection();
        this.model.on('reset', this.render, this);
        this.model.on('add', this.updateGrid, this);
      },

      /**
       * If an <url> is specified it will load the
       * grid collection from that endpoint.
       * If not, then the <row> option will be used to
       * reset the collection
       */
      defaultAction : function() {
        if (this.options.url) {
          this.load();
        } else {
          this.model.reset(this.options.rows);
        }
      },

      doLoad : function() {
        this.model.fetch({url : this.options.url});
      },

      addRow : function(row) {
        this.model.add(row);
      },

      doRender : function() {
        $(this.$el).jqGrid({
          datatype: 'local',
          height: this.options.heigth,
          width: this.options.width,
          colNames: this.options.columnNames,
          colModel: this.options.columnModels,
          caption: this.options.caption
        });

        var grid = $(this.$el);
        this.model.each(function(row, index) {
          grid.jqGrid('addRowData', index + 1, row.toJSON());
        });

        //shrink to width
        grid.setGridWidth(this.options.width, true);
      },

      updateGrid : function(data) {
        var grid = $(this.$el);
        var row = data.toJSON();
        if (this.options.attrMap) {
          row = _.pick(row, this.options.attrMap);
        }
        grid.jqGrid('addRowData', this.model.length - 1, row);
      },

      getSelectedRowId : function() {
        var grid = $(this.$el);
        return grid.jqGrid ('getGridParam', 'selrow');
      }
    });

    return GridView;
  }
);