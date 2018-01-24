sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
  "use strict";

  return BaseController.extend("com.sap.build.standard.dormimundo.controller.Dormimundo", {
    handleRouteMatched: function (oEvent) {

      var oParams = {};
      var oView = this.getView();
      var bSelectFirstListItem= true;

      if (oEvent.mParameters.data.context || oEvent.mParameters.data.masterContext) {
        this.sContext = oEvent.mParameters.data.context;
        var oPath;
        this.sMasterContext = oEvent.mParameters.data.masterContext;
        if (this.sMasterContext) {
          oPath = {path: "/" + this.sMasterContext, parameters: oParams};
          this.getView().bindObject(oPath);
        } else if (this.sContext) {
          var sCurrentContextPath = "/" + this.sContext;

          bSelectFirstListItem = false;
        }

      }
      if (bSelectFirstListItem) {
        oView.addEventDelegate({
          onBeforeShow: function () {
            var oContent = this.getView().getContent();
            if (oContent) {
              if (!sap.ui.Device.system.phone) {
                var oList = oContent[0].getContent() ? oContent[0].getContent()[0] : undefined;
                if (oList) {
                  var sContentName = oList.getMetadata().getName();
                  if (sContentName.indexOf("List") > -1) {
                    oList.attachEventOnce("updateFinished", function () {
                      var oFirstListItem = this.getItems()[0];
                      if (oFirstListItem) {
                        oList.setSelectedItem(oFirstListItem);
                        oList.fireItemPress({listItem: oFirstListItem});
                      }
                    }.bind(oList));
                  }
                }
              }
            }
          }.bind(this)
        });
      }
    },
    _attachSelectListItemWithContextPath: function (sContextPath) {
      var oView = this.getView();
      var oContent = this.getView().getContent();
      if (oContent) {
        if (!sap.ui.Device.system.phone) {
          var oList = oContent[0].getContent() ? oContent[0].getContent()[0] : undefined;
          if (oList && sContextPath) {
            var sContentName = oList.getMetadata().getName();
            var oItemToSelect, oItem, oContext, aItems, i;
            if (sContentName.indexOf("List") > -1) {
              if (oList.getItems().length) {
                oItemToSelect = null;
                aItems = oList.getItems();
                for (i = 0; i < aItems.length; i++) {
                  oItem = aItems[i];
                  oContext = oItem.getBindingContext();
                  if (oContext && oContext.getPath() === sContextPath) {
                    oItemToSelect = oItem;
                  }
                }
                if (oItemToSelect) {
                  oList.setSelectedItem(oItemToSelect);
                }
              } else {
                oView.addEventDelegate({
                  onBeforeShow: function () {
                    oList.attachEventOnce("updateFinished", function () {
                      oItemToSelect = null;
                      aItems = oList.getItems();
                      for (i = 0; i < aItems.length; i++) {
                        oItem = aItems[i];
                        oContext = oItem.getBindingContext();
                        if (oContext && oContext.getPath() === sContextPath) {
                          oItemToSelect = oItem;
                        }
                      }
                      if (oItemToSelect) {
                        oList.setSelectedItem(oItemToSelect);
                      }
                    });
                  }
                });
              }
            }

          }
        }
      }



    },

    _onCloseSession: function(oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();
      
      $.ajax({
        method: 'POST',
        url: '/connect/session.php',
        type: 'json',
        async: false,
        data: {
          'type': 'close_session',
        },
        success: function (result) {
          var jsonResult = JSON.parse(result);
          location.reload();

        },
        error: function (err) {
          console.log(err);
        }
      });



      return;
    },

    _onImagePress: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("Home", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    doNavigate: function (sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {

      var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
      var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

      var sEntityNameSet;
      if (sPath !== null && sPath !== "") {
        if (sPath.substring(0, 1) === "/") {
          sPath = sPath.substring(1);
        }
        sEntityNameSet = sPath.split("(")[0];
      }
      var sNavigationPropertyName;
      var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

      if (sEntityNameSet !== null) {
        sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
      }
      if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
        if (sNavigationPropertyName === "") {
          this.oRouter.navTo(sRouteName, {
            context: sPath,
            masterContext: sMasterContext
          }, false);
        } else {
          oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function (bindingContext) {
            if (bindingContext) {
              sPath = bindingContext.getPath();
              if (sPath.substring(0, 1) === "/") {
                sPath = sPath.substring(1);
              }
            }
            else {
              sPath = "undefined";
            }

// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
if (sPath === "undefined") {
  this.oRouter.navTo(sRouteName);
} else {
  this.oRouter.navTo(sRouteName, {
    context: sPath,
    masterContext: sMasterContext
  }, false);
}
}.bind(this));
        }
      } else {
        this.oRouter.navTo(sRouteName);
      }

      if (typeof fnPromiseResolve === "function") {
        fnPromiseResolve();
      }
    },
    _onNavigationListItemFirstLevelSelect: function (oEvent) {

            var sDialogName = "Dialog12";
        this.mDialogs = this.mDialogs || {};
        var oDialog = this.mDialogs[sDialogName];
        var oSource = oEvent.getSource();
        var oBindingContext = oSource.getBindingContext();
        var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
        var oView;
        if (!oDialog) {
          this.getOwnerComponent().runAsOwner(function () {
            oView = sap.ui.xmlview({viewName: "com.sap.build.standard.dormimundo.view." + sDialogName});
            this.getView().addDependent(oView);
            oView.getController().setRouter(this.oRouter);
            oDialog = oView.getContent()[0];
            this.mDialogs[sDialogName] = oDialog;
          }.bind(this));
        }

        return new Promise(function(fnResolve) {
          oDialog.attachEventOnce("afterOpen", null, fnResolve);
          oDialog.open();
          if (oView) {
            oDialog.attachAfterOpen(function () {
              oDialog.rerender();
            });
          } else {
            oView = oDialog.getParent();
          }

          var oModel = this.getView().getModel();
          if (oModel) {
            oView.setModel(oModel);
          } 
          if (sPath) {
            var oParams = oView.getController().getBindingParameters();
            oView.bindObject({path: sPath, parameters: oParams});
          }
        }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect1: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("CapturaDePedidos", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect2: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("AbonosBusquedaDePedidos", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect3: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("ReimpresionPedidosBusquedaDePedido", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect4: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("ActualizacionPedidosBusquedaDePedido", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect5: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("TransferirPedidosBuscarPedido", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect6: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("ReporteDeArticulos", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect7: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("ReporteDeInventario", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect8: function (oEvent) {

      var oBindingContext = oEvent.getSource().getBindingContext();

      return new Promise(function(fnResolve) {

        this.doNavigate("DiarioDeVentas", oBindingContext, fnResolve, ""
          );
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect9: function (oEvent) {

      var sDialogName = "Dialog10";
      this.mDialogs = this.mDialogs || {};
      var oDialog = this.mDialogs[sDialogName];
      var oSource = oEvent.getSource();
      var oBindingContext = oSource.getBindingContext();
      var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
      var oView;
      if (!oDialog) {
        this.getOwnerComponent().runAsOwner(function () {
          oView = sap.ui.xmlview({viewName: "com.sap.build.standard.dormimundo.view." + sDialogName});
          this.getView().addDependent(oView);
          oView.getController().setRouter(this.oRouter);
          oDialog = oView.getContent()[0];
          this.mDialogs[sDialogName] = oDialog;
        }.bind(this));
      }

      return new Promise(function(fnResolve) {
        oDialog.attachEventOnce("afterOpen", null, fnResolve);
        oDialog.open();
        if (oView) {
          oDialog.attachAfterOpen(function () {
            oDialog.rerender();
          });
        } else {
          oView = oDialog.getParent();
        }

        var oModel = this.getView().getModel();
        if (oModel) {
          oView.setModel(oModel);
        }
        if (sPath) {
          var oParams = oView.getController().getBindingParameters();
          oView.bindObject({path: sPath, parameters: oParams});
        }
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    _onNavigationListItemFirstLevelSelect10: function (oEvent) {

      var sDialogName = "Dialog11";
      this.mDialogs = this.mDialogs || {};
      var oDialog = this.mDialogs[sDialogName];
      var oSource = oEvent.getSource();
      var oBindingContext = oSource.getBindingContext();
      var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
      var oView;
      if (!oDialog) {
        this.getOwnerComponent().runAsOwner(function () {
          oView = sap.ui.xmlview({viewName: "com.sap.build.standard.dormimundo.view." + sDialogName});
          this.getView().addDependent(oView);
          oView.getController().setRouter(this.oRouter);
          oDialog = oView.getContent()[0];
          this.mDialogs[sDialogName] = oDialog;
        }.bind(this));
      }

      return new Promise(function(fnResolve) {
        oDialog.attachEventOnce("afterOpen", null, fnResolve);
        oDialog.open();
        if (oView) {
          oDialog.attachAfterOpen(function () {
            oDialog.rerender();
          });
        } else {
          oView = oDialog.getParent();
        }

        var oModel = this.getView().getModel();
        if (oModel) {
          oView.setModel(oModel);
        }
        if (sPath) {
          var oParams = oView.getController().getBindingParameters();
          oView.bindObject({path: sPath, parameters: oParams});
        }
      }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

    },
    onInit: function () {
      this.mBindingOptions = {};
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.getTarget("Dormimundo").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
    }
  });
},


/* bExport= */true);
