  sap.ui.define([
      "com/sap/build/standard/dormimundo/controller/BaseController",
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/routing/History"
    ], function (BaseController, JSONModel, History) {
      "use strict";

      return BaseController.extend("com.sap.build.standard.dormimundo.controller.App", {

        onInit : function () {

          var oViewModel,
            oListSelector = this.getOwnerComponent().oListSelector,
            iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

          oViewModel = new JSONModel({
            busy : true,
            delay : 0
          });
          this.setModel(oViewModel, "appView");
          //console.log(this.byId("idAppControl").setMode("HideMode"));
          // Makes sure that master view is hidden in split app
          // after a new list entry has been selected.
          oListSelector.attachListSelectionChange(function () {
            this.byId("idAppControl").hideMaster();
          }, this);

          // apply content density mode to root view
          this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

          return new Promise(function (fnResolve) {
            oViewModel.setProperty("/busy", false);
            oViewModel.setProperty("/delay", iOriginalBusyDelay);
            fnResolve();
          }.bind(this));
        }
      });
    }
  );