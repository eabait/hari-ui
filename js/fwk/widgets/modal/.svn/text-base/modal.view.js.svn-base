/**
 * Modal View object
 *
 * @author  Juan Ignacio Saenz <juan.saenz@globant.com>
 */
/*
 * If you call it
 * <a data-toggle="modal" href="#modal-wrapper">click</a>
 * is important to crate before that this
 * <div id="modal-wrapper" class="modal in hide"></div>
 */

define(
  [
    'container.view',
    'jquery',
    'handlebars',
    'text!./modal.tpl.html',
    'bootstrap'
  ],
  function(ContainerView, $, Handlebars, template) {
    'use strict';

    var ModalView = ContainerView.extend({

      onshow: 'fade',

      template: template,

      data : {},

      setUp : function() {
        this.refId = "#modal-wrapper" + this.cid;
        this.data = this.options.data;
        this.data.id = this.refId;
        for (var i = 0; i < this.data.buttons.length; i++) {
          if (this.data.buttons[i].action === 'cancel') {
            this.data.buttons[i].cancelBtn = true;
          }
        }
      },

      postRender : function() {
        var contentView = this.options.data.contentView;
        this.addView('.modal-body',contentView);
        this.showView('.modal-body');
        // Assign button's events
        var button = null;
        for (var i = 0; i < this.data.buttons.length; i++) {
          button = this.data.buttons[i];
          if (button.event) {
            //this.events.push('click #' + button.idBtn + ': ');
            this.$el.find('#' + button.idBtn).on('click', button.event);
          }
        }
      },

      toggle : function() {
        this.$el.modal('toggle');
      }
    });

    return ModalView;
  }
);