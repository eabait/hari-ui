/**
 * Breadcrumb View object
 *
 * @author  Esteban S. Abait <esteban.abait@globant.com>
 */

define(
  [
    'base.view',
    'pubsub',
    'jquery',
    'handlebars',
    'underscore',
    './breadcrumb.model',
    'text!./breadcrumb.tpl.html'
  ],
  function(BaseView, PubSub, $, Handlebars, _, BreadcrumbModel, breadcrumbTpl) {
    'use strict';

    var BreadcrumbView = BaseView.extend({

      events : {
        'click .breadcrumb li a' : 'onBreadcrumbClick',
        'click .breadcrumb-home' : 'onBreadcrumbClick'
      },

      initialize : function() {
        //save compiled template
        this.cachedTemplate = Handlebars.compile(breadcrumbTpl);

        this.model = BreadcrumbModel;
        //set up bindings
        this.model.on('change', this.render, this);

        PubSub.subscribe('navigation', _.bind(this.addNewItem, this));
      },

      addNewItem : function(topic, e) {
        if (e.src === 'Breadcrumb') {
          return;
        }
        if (e.src === 'Menu') {
          this.model.rebootTail(e);
          $('#home-btn').attr('data-name',e.to);
          return;
        }

        if (e.action && e.action === 'back') {
          this.model.goBack();
        } else {
          this.model.addNavigationElement(e);
        }
      },

      doRender : function() {
        //navigator template
        var data = {
          breadcrumb : this.model.getPath(),
          active : this.model.getActive()
        };
        this.$el.html(this.cachedTemplate(data));
      },

      onBreadcrumbClick : function(e) {
        e.preventDefault();
        var link = $(e.target).attr('data-name');
        var element = this.model.getNavigationElement(link);

        if (element) {
          var source = (element.type === 'external') ?
            'Menu' : 'Breadcrumb';

          if (element.type !== 'external') {
            this.model.removeTail(element);
          }
          PubSub.publish('navigation', {
            src: source,
            to: element.to,
            data: element.data
          });
        }
      }
    });

    return new BreadcrumbView();
  }
);