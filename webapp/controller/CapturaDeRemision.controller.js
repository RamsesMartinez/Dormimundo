sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History",
    'sap/ui/model/json/JSONModel'
], function(BaseController, MessageBox, Utilities, History, JSONModel) {
    "use strict";

    return BaseController.extend("com.sap.build.standard.dormimundo.controller.CapturaDeRemision", {
        handleRouteMatched: function (oEvent) {
            var oParams = {};
            var oView = this.getView();
            var oModelCliente = new JSONModel(sap.ui.getCore().getModel('/Cliente'));
            var oModelAgente = new JSONModel(sap.ui.getCore().getModel('/Agente'));
            var sFecha = oView.byId('fecha');

            // Inserta la fecha formateada
            var fecha = new Date(),
                dd = fecha.getDate(),
                mm = fecha.getMonth() + 1,
                yyyy = fecha.getFullYear();

            if (dd < 10){
                dd = '0' + dd;
            }
            if (mm < 10){
                mm= '0' + mm;
            }
            fecha = yyyy + '/' + mm + '/' + dd;

            sFecha.setValue(fecha);

            oView.setModel(oModelAgente, "/Agente");
            oView.setModel(oModelCliente, "/Cliente");

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;
                var oPath;
                if (this.sContext) {
                    oPath = {path: "/" + this.sContext, parameters: oParams};
                    this.getView().bindObject(oPath);
                }
            }
        },
        _onButtonPress3: function (oEvent) {
            var sDialogName = "Dialog1";
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
        _onInputLiveChange: function (oEvent) {

            var sDialogName = "Dialog2";
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
        _onInputLiveChange1: function (oEvent) {

            var sDialogName = "Dialog2";
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
        _onInputLiveChange2: function (oEvent) {

            var sDialogName = "Dialog2";
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
        _onButtonPress4: function (oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function(fnResolve) {

                this.doNavigate("CapturaDeRemisionDatosDeCliente", oBindingContext, fnResolve, "");
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
        onInit: function () {
            this.mBindingOptions = {};
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("CapturaDeRemision").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
            this.oModel = this.getOwnerComponent().getModel();

        }
    });
}, /* bExport= */true);
