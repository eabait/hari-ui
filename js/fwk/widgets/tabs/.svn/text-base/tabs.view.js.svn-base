/**
 * Properties View object
 *
 * @author  Mauro Buselli <mauro.buselli@globant.com>
 */

define(
  [
    'container.view',
    'jquery',
    'underscore',
    'handlebars',
    'text!./tabs.tpl.html'
  ],
  function(ContainerView, $, _, Handlebars, tabsTpl) {
    'use strict';

    var TabsView = ContainerView.extend({

      name: 'TabView',

      // events: {
      //   'click nav a': 'onClickTab'
      // },

      lastTabSelected : null,  // the last tab's DOM element selected (only of the 'tab').
      lastViewSelected : null, // the last View (or ContainerView) selected.

      tabIndex : 0,  // the index of the last tab, usefull to add new tabs

      /**
       * Override the doRender, now it doesn't renderize each of the container's views,
       *  instead it renderizes the tabs and display the first tab view.
       */
      doRender : function() {
        this.tabIndex = this.options.tabs.length || 0;

        var data = {
          id: this.cid,
          tabs : []
        };

        var tabNames = this.options.tabs;
        var tabIcons = this.options.icons || [];
        var tabViews = this.options.views;
        // tab-group unique id to allow inherit tabs inside other tab's views:
        this.tabGroupId = this.cid;
        this.tabOrderBase = this.tabGroupId + '-tab-order-';
        this.tabPanelBase = this.tabGroupId + '-tab-panel-';

        var i, l;
        for (i = 0, l = tabNames.length; i < l; ++i) {
          data.tabs.push({
            tabId : this.tabGroupId + i,
            tabName : tabNames[i],
            icon : tabIcons[i] || "",
            tabOrder : this.tabOrderBase + i,
            tabPanel: this.tabPanelBase + i
          });
        }

        // overrides the cachedTemplate for this tabs template
        this.cachedTemplate = Handlebars.compile(tabsTpl);
        this.$el.html(this.cachedTemplate(data));

        for (i = 0, l = tabViews.length; i < l; ++i) {
          this.addView('#' + this.tabPanelBase + i, tabViews[i]);
          this.showView('#' + this.tabPanelBase + i);
          tabViews[i].hide();
          this.addEventHandler(this.tabGroupId + i);
        }

        //show first tab
        this.selectTab(0);
      },

      addEventHandler : function(tabId) {
        this.$el.find('#' + tabId)
          .on('click', _.bind(this.onClickTab, this));
      },

      addNewTab : function(options) {
        //var index = this.options.tabs.length;

        var name = options.name;
        var subView = options.subView;
        var tabHeader, tabBody;

        this.options.views.push(subView);

        tabHeader = '<li id="' + this.tabGroupId + this.tabIndex + '">';
        tabHeader += '<a href="" data-tab-order="' + this.tabOrderBase + this.tabIndex + '">' + name + '</a></li>';
        tabBody = '<div id="' + this.tabPanelBase + this.tabIndex +'" class="tab-panel ui-help-tabs-border tab-border-top"></div>';

        this.$el
          .find('.popup-option-list')
          .append(tabHeader);
        this.$el.append(tabBody);

        this.addView('#' + this.tabPanelBase + this.tabIndex, subView);
        this.showView('#' + this.tabPanelBase + this.tabIndex);
        subView.hide();

        this.addEventHandler(this.tabGroupId + this.tabIndex);
        this.selectTab(this.tabIndex);

        this.tabIndex++;
      },

      /**
       * Tab click handler
       * @param  {[type]} event [description]
       */
      onClickTab: function(event) {
        event.preventDefault();

        var tabIndex = $(event.target).attr('data-tab-order');
        this.selectTab(this.getTabNumber(tabIndex));
      },

      /**
       * gets the tab number according a data tab order field
       * @param  {string} dataTabOrder the data-tab-order DOM's
       *                               anchor attribute.
       * @return {integer}              a tab number
       */
      getTabNumber : function(dataTabOrder) {
        return dataTabOrder.substr(this.tabOrderBase.length);
      },

      /**
       * Switch to a different tab
       */
      selectTab : function(tabNr) {
        if (tabNr !== this.lastTabSelected) {
          this.$el.find('a[data-tab-order=' + this.tabOrderBase + tabNr + ']')
            .parent().addClass('active');

          this.options.views[tabNr].show();

          if (this.lastTabSelected != null) {
            this.options.views[this.lastTabSelected].hide();
            this.$el.find('a[data-tab-order=' + this.tabOrderBase + this.lastTabSelected + ']').parent().removeClass('active');
          }
          this.lastTabSelected = tabNr;
        }
      },

      cleanUp : function() {
        //TODO: call super.cleanUp and clean own instance variables

        //Remove tab views:
        for (var v in this.options.views) {
          this.options.views[v].remove();
        }

        //Unbind the click event on tabs
        this.$el.undelegate('click');
        this.$el.empty();
      }

    });

    return TabsView;
  }
);