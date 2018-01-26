sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "./utilities",
    "sap/ui/core/routing/History",
    'sap/ui/model/Filter',
    'sap/ui/model/json/JSONModel'
], function(BaseController, MessageBox, Utilities, History) {
    "use strict";

    return BaseController.extend("com.sap.build.standard.dormimundo.controller.Dialog_BuscarCliente", {
        setRouter: function (oRouter) {
            this.oRouter = oRouter;
        },

        getBindingParameters: function () {
            return {};
        },

        _onButtonSearchClientes: function (oEvent) {
            var hostServidor;
            var ClientesLista;
            var oView = this.getView();
            var oModel = oView.getModel();
            var oComponent = this.getOwnerComponent();

            var oTxtNombre = oView.byId('searchClienteNombre').mProperties;
            var oTxtAPaterno = oView.byId('searchClienteAPaterno').mProperties;
            var oTxtAMaterno = oView.byId('searchClienteAMaterno').mProperties;

            var sNombre = oTxtNombre.value.trim();
            var sAPaterno = oTxtAPaterno.value.trim();
            var sAMaterno = oTxtAMaterno.value.trim();

            // Si no hay nada en ninguno de los campos termina el método
            if (sNombre === '' && sAPaterno === '' && sAMaterno === '') {
                return;
            }

            // Limpia el modelo de Clientes actual
            oModel.setProperty('/ClientesLista', []);
            hostServidor = oComponent.getManifestEntry('sys.pos')['servidorCentral'];

            $.ajax({
                method: 'GET',
                url: hostServidor + '/POS/xsjs/Datos/BusquedaClienteList.xsjs',
                data: {
                    'sNombreCliente': sNombre,
                    'sApellidoPaternoCliente': sAPaterno,
                    'sApellidoMaternoCliente': sAMaterno
                },
                type: 'json',
                async: false,
                success: function (result) {
                    ClientesLista = result.ClientesLista;
                    oModel.setProperty('/ClientesLista', ClientesLista);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },

        _onButtonPress3: function (oEvent) {

            var oBindingContext = oEvent.getSource().getBindingContext();

            return new Promise(function(fnResolve) {

                this.doNavigate("ClientesCrearCliente", oBindingContext, fnResolve, ""
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

        _onButtonAceptar: function (oEvent) {
            var oView = this.getView();
            var oModel;
            var oBindingContext = oEvent.getSource().getBindingContext();
            var oSelectedItems,
                oSelectedItem,
                sMembresia;

            oSelectedItems  = oView.byId('tableCustomers').getSelectedItems();

            // Valida que haya resultados en la tabla de clientes
            if (oSelectedItems.length === 0) {
                return;
            }

            oSelectedItem = oSelectedItems[0].getCells();
            sMembresia = oSelectedItem[0].getText();

            oModel = {
                'ClienteActual': sMembresia
            };

            sap.ui.getCore().setModel(oModel, 'ClienteActual');

            return new Promise(function(fnResolve) {
                this.doNavigate("CapturaDeRemision", oBindingContext, fnResolve, "");
            }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});

        },

        onInit: function () {
            this.mBindingOptions = {};
            this._oDialog = this.getView().getContent()[0];
            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData({
                "ClientesLista": []
            });

            this.getView().setModel(oModel);
        },

        onExit: function () {
            this._oDialog.close();
        }
    });
}, /* bExport= */true);
