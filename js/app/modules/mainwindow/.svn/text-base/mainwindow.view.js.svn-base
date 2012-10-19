define(
  [
    'container.view',
    'text!./mainwindow.tpl.html',
    'fwk/widgets/menu/menu.view',
    'fwk/widgets/footer/footer.view',
    'fwk/widgets/breadcrumb/breadcrumb.view'
  ],
  function(ContainerView, mainLayoutTpl, MenuView, FooterView, BreadcrumbView) {
    'use strict';

    var MainWindow = ContainerView.extend({
      el: $('body'),

      name: 'MainWindow',

      template: mainLayoutTpl,

      menuWidget : null,

      setUp : function() {
        //add super-menu widget
        var mainMenuItems = [
          {
            id : 'designstudio',
            url: 'designstudio',
            name : 'Design Studio'
          },
          {
            id : 'solutionbrowser',
            url: 'solutionbrowser',
            name : 'Solution Browser'
          },
          {
            id : 'myinstances',
            url: 'myinstances',
            name : 'My Instances'
          },
          {
            id : 'systemadministration',
            url: 'systemadministration',
            name : 'System Administration'
          }
        ];
        this.menuWidget = MenuView;
        this.menuWidget.addItems(mainMenuItems);
        this.addView('header', this.menuWidget);

        //Add breadcrumb widget
        this.addView('.breadcrumb-container', BreadcrumbView);

        //Add footer widget
        this.addView('footer', new FooterView());
      }
    });

    return new MainWindow();
  }
);