sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History"
    ], function(BaseController, MessageBox, Utilities, History) {
    "use strict";

    return BaseController.extend("com.sap.build.standard.dormimundo.controller.ReimpresionPedidosReimpresionDelPedido", {
    handleRouteMatched: function (oEvent) {
            		
		var oParams = {}; 
		
		        sap.ui.getCore().byId("App").setMode(sap.m.SplitAppMode.HideMode);
		
		if (oEvent.mParameters.data.context) { 
		    this.sContext = oEvent.mParameters.data.context;
		    var oPath; 
		    if (this.sContext) { 
		        oPath = {path: "/" + this.sContext, parameters: oParams}; 
		        this.getView().bindObject(oPath);
		    } 
		}
		
		
		
        },
_onPageNavButtonPress10: function () {
            		
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
_onButtonPress25: function (oEvent) {
            		
		oEvent = jQuery.extend(true, {}, oEvent);
		return new Promise(function (fnResolve) { fnResolve(true); })
		.then(function (result) {
		    
		var oBindingContext = oEvent.getSource().getBindingContext(); 
		
		return new Promise(function(fnResolve) {
		
		    this.doNavigate("ReimpresionPedidosBusquedaDePedido", oBindingContext, fnResolve, ""
		    );
		}.bind(this));
		
		}.bind(this))
		.then(function (result) { if (result === false) { return false; } else {
		    var oView = this.getView();
		var oController = this;
		
		return new Promise(function (fnResolve, fnReject) {
		        var oModel = oController.oModel;
		        
		        var fnResetChangesAndReject = function (sMessage) {
		            oModel.resetChanges();
		            fnReject(new Error(sMessage));
		        };
		        if (oModel && oModel.hasPendingChanges()) {
		            oModel.submitChanges({
		                success: function (oResponse) {
		                    var oBatchResponse = oResponse.__batchResponses[0];
		                    var oChangeResponse = oBatchResponse.__changeResponses && oBatchResponse.__changeResponses[0];
		                    if (oChangeResponse && oChangeResponse.data) {
		                        var sNewContext = oModel.getKey(oChangeResponse.data);
		                        oView.unbindObject();
		                        oView.bindObject({path: "/" + sNewContext});
		                        if (window.history && window.history.replaceState) {
		                            window.history.replaceState(undefined, undefined, window.location.hash.replace(encodeURIComponent(oController.sContext), encodeURIComponent(sNewContext)));
		                        }
		                        oModel.refresh();
		                        fnResolve();
		                    }
		                    else if (oChangeResponse && oChangeResponse.response) {
		                        fnResetChangesAndReject(oChangeResponse.message);
		                    }
		                    else if (!oChangeResponse && oBatchResponse.response) {
		                        fnResetChangesAndReject(oBatchResponse.message);
		                    }
		                    else {
		                        oModel.refresh();
		                        fnResolve();
		                    }
		                },
		                error: function (oError) {
		                    fnReject(new Error(oError.message));
		                }
		            });
		        } else {
		            fnResolve();
		        }
		    });
		
		}}.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
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
onInit: function () {
            		
        this.mBindingOptions = {};
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getTarget("ReimpresionPedidosReimpresionDelPedido").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
        var oView = this.getView();
        oView.addEventDelegate({
            onBeforeShow: function () {
                if (sap.ui.Device.system.phone) {
                    var oPage = oView.getContent()[0];
                    if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                        oPage.setShowNavButton(true);
                        oPage.attachNavButtonPress(function () {
                            this.oRouter.navTo("ReimpresionPedidosBusquedaDePedido", {}, true);
                        }.bind(this));
                    }
                }
            }.bind(this)
        });

        this.oModel = this.getOwnerComponent().getModel();


        }
});
}, /* bExport= */true);
