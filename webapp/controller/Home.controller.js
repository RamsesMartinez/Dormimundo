sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
  "use strict";

  return BaseController.extend("com.sap.build.standard.dormimundo.controller.Home", {
    handleRouteMatched: function (oEvent) {
      this.getView().getParent().getParent().setMode("ShowHideMode");

      var oParams = {};

      if (sap.ui.Device.system.desktop) {
        //sap.ui.getCore().byId("App").setMode(sap.m.SplitAppMode.StretchCompressMode);
      } else {
        //sap.ui.getCore().byId("App").setMode(sap.m.SplitAppMode.ShowHideMode);
      }
      if (oEvent.mParameters.data.context) {
        this.sContext = oEvent.mParameters.data.context;
        var oPath;
        if (this.sContext) {
          oPath = {path: "/" + this.sContext, parameters: oParams};
          this.getView().bindObject(oPath);
        }
      }



    },
    onInit: function () {

      this.mBindingOptions = {};
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.getTarget("Home").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
      var oView = this.getView();
      oView.addEventDelegate({
        onBeforeShow: function () {
          if (sap.ui.Device.system.phone) {
            var oPage = oView.getContent()[0];
            if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
              oPage.setShowNavButton(true);
              oPage.attachNavButtonPress(function () {
                this.oRouter.navTo("Dormimundo", {}, true);
              }.bind(this));
            }
          }
        }.bind(this)
      });

    }
  });
}, /* bExport= */true);
