sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, Utilities, History) {
    "use strict";

    return BaseController.extend("com.sap.build.standard.dormimundo.controller.TransferirPedidosTipoDeTransferencia", {
    handleRouteMatched: function (oEvent) {
            		
		var oParams = {}; 
		
		    if (sap.ui.Device.system.desktop) {
		        sap.ui.getCore().byId("App").setMode(sap.m.SplitAppMode.StretchCompressMode);
		    } else {
		        sap.ui.getCore().byId("App").setMode(sap.m.SplitAppMode.ShowHideMode);
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
_onPageNavButtonPress11: function () {
            		
		var oHistory = History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();
		var oQueryParams = this.getQueryParameters(window.location);
		
		if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
		    window.history.go(-1);
		} else {
		    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		    oRouter.navTo("default", true);
		}
        },
getQueryParameters: function (oLocation) {
            		
		var oQuery = {};
		var aParams = oLocation.search.substring(1).split("&");
		for (var i = 0; i < aParams.length; i++) {
		    var aPair = aParams[i].split("=");
		    oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
		}
		return oQuery;
		
        },
_onButtonPress26: function (oEvent) {
            		
		var sDialogName = "Dialog9";
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
_onButtonPress27: function (oEvent) {
            		
		var oBindingContext = oEvent.getSource().getBindingContext(); 
		
		return new Promise(function(fnResolve) {
		
		    this.doNavigate("CapturaDeRemision_1", oBindingContext, fnResolve, ""
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
_onButtonPress28: function (oEvent) {
            		
		var oBindingContext = oEvent.getSource().getBindingContext(); 
		
		return new Promise(function(fnResolve) {
		
		    this.doNavigate("CapturaDePedidos", oBindingContext, fnResolve, ""
		    );
		}.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
		
        },
onInit: function () {
            		
        this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("TransferirPedidosTipoDeTransferencia").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
        var oView = this.getView();
        oView.addEventDelegate({
            onBeforeShow: function () {
                if (sap.ui.Device.system.phone) {
                    var oPage = oView.getContent()[0];
                    if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                        oPage.setShowNavButton(true);
                        oPage.attachNavButtonPress(function () {
                            this.oRouter.navTo("TransferirPedidosBuscarPedido", {}, true);
                        }.bind(this));
                    }
                }
            }.bind(this)
        });

        }
});
}, /* bExport= */true);
