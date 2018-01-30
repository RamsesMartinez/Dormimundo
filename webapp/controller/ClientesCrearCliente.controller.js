sap.ui.define(["sap/ui/core/mvc/Controller",
    'jquery.sap.global',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "./utilities",
    'sap/ui/model/SimpleType',
    'sap/ui/model/ValidateException',
    "sap/ui/core/routing/History",
    'sap/ui/model/json/JSONModel'

], function(BaseController, jQuery, MessageBox, MessageToast, Utilities, SimpleType, ValidateException, History, JSONModel    ) {
    "use strict";

    return BaseController.extend("com.sap.build.standard.dormimundo.controller.ClientesCrearCliente", {
        handleRouteMatched: function (oEvent) {
            var oParams = {};
            var oView = this.getView();
            var oComponent = this.getOwnerComponent();
            var sCodigoSucursal = oComponent.getManifestEntry('sys.pos')['codigoSucursal'];
            var oModel,
                oCliente,
                sMembresiaCliente,
                sNuevoCodigoCliente;

            // Genera el código del nuevo cliente
            $.ajax({
                url: '/connect/SYS_PClientes.php',
                method: 'POST',
                type: 'json',
                async: false,
                data: {
                    'type': 'get_membresia_cliente',
                    'codigo_sucursal': sCodigoSucursal
                },
                success: function (result) {
                    console.log(result);
                    if ($.isEmptyObject(result)) {
                        alert("No se ha podido generar la membresía");
                        return;
                    }
                    var LONG_COD_CLIENTE = 6;
                    sNuevoCodigoCliente = result['U_SYS_FOLI'].toString();

                    for (var i = 0; i < LONG_COD_CLIENTE; i++) {
                        if (sNuevoCodigoCliente.length < LONG_COD_CLIENTE) {
                            sNuevoCodigoCliente = '0' + sNuevoCodigoCliente;
                        }
                    }
                    sMembresiaCliente = sCodigoSucursal + sNuevoCodigoCliente;

                },
                error: function (error) {
                    MessageBox.alert("handleRouteMatched. Error: " + error.responseText);
                }
            });

            oCliente = {
                'code': sNuevoCodigoCliente,
                'sucursal': sCodigoSucursal,
                'membresia': sMembresiaCliente
            };

            // Convierte el objeto oCliente en Modelo
            oModel =  new sap.ui.model.json.JSONModel(oCliente);

            var miForm = oView.byId('crearClienteForm');
            miForm.setModel(oModel, "/NuevoCliente");

            if (oEvent.mParameters.data.context) {
                this.sContext = oEvent.mParameters.data.context;
                var oPath;
                if (this.sContext) {
                    oPath = {path: "/" + this.sContext, parameters: oParams};
                    this.getView().bindObject(oPath);
                }
            }
        },
        _onButtonCrearCliente: function (oEvent) {
            var oView = this.getView();
            var oModel = oView.byId('crearClienteForm').getModel('/NuevoCliente');
            var oBindingContext = oEvent.getSource().getBindingContext();

            console.log(oModel);

            var aInputs = [
                oView.byId("txtNombre"),
                oView.byId("txtApellidoPaterno"),
                oView.byId("txtApellidoMaterno"),
                oView.byId("txtCalle"),
                oView.byId("txtNumeroExterior"),
                oView.byId("txtNumeroInterior"),
                oView.byId("txtColonia"),
                oView.byId("txtDelegacion"),
                oView.byId("txtEstado"),
                oView.byId("txtCiudad"),
                oView.byId("txtCodigoPostal"),
                oView.byId("txtPais"),
                oView.byId("txtTelefono1"),
                oView.byId("txtTelefono2"),
                oView.byId("txtReferencias")
            ];
            var bValidationError = false,
                success = false;

            // check that inputs are not empty
            // this does not happen during data binding as this is only triggered by changes
            jQuery.each(aInputs, function (i, oInput) {
                var oBinding = oInput.getBinding("value");
                try {
                    oBinding.getType().validateValue(oInput.getValue());
                    oInput.setValueState("None");
                } catch (oException) {
                    oInput.setValueState("Error");
                    bValidationError = true;
                }
            });

            if (bValidationError === false) {
                $.ajax({
                    url: '/connect/SYS_PClientes.php',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    data: {
                        type: 'crear_cliente',
                        sCode: oModel.getProperty('/code'),
                        sSucursal: oModel.getProperty('/sucursal'),
                        sMembresia: oModel.getProperty('/membresia'),
                        sNombre: oModel.getProperty('/nombre'),
                        sApellidoPaterno: oModel.getProperty('/apellidoPaterno'),
                        sApellidoMaterno: oModel.getProperty('/apellidoMaterno'),
                        sCalle: oModel.getProperty('/calle'),
                        sNumeroExterior: oModel.getProperty('/numeroExterior'),
                        sNumeroInterior: oModel.getProperty('/numeroInterior'),
                        sColonia: oModel.getProperty('/colonia'),
                        sDelegacion: oModel.getProperty('/delegacion'),
                        sEstado: oModel.getProperty('/estado'),
                        sCiudad: oModel.getProperty('/ciudad'),
                        sCodigoPostal: oModel.getProperty('/codigoPostal'),
                        sPais: oModel.getProperty('/pais'),
                        sTelefono1: oModel.getProperty('/telefono1'),
                        sTelefono2: oModel.getProperty('/telefono2'),
                        sEmail: oModel.getProperty('/email'),
                        sReferencias: oModel.getProperty('/referencias')
                    }
                })
                .done(function(result) {
                    console.log("Cliente creado");
                    success = true;
                })
                .fail(function(error) {
                    MessageBox.alert("_onButtonCrearCliente. Error: ");
                    console.log("Error %o ", error);
                });
                
            }

            if (success === true) {
                return new Promise(function(fnResolve) {

                    this.doNavigate("CapturaDeRemision", oBindingContext, fnResolve, ""
                    );
                }.bind(this)).catch(function (err) { if (err !== undefined) { MessageBox.error(err.message); }});
            }
            

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
            var oView = this.getView();
            this.mBindingOptions = {};
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getTarget("ClientesCrearCliente").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtNombre"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtApellidoPaterno"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtApellidoMaterno"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtCalle"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtNumeroExterior"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtNumeroInterior"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtColonia"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtDelegacion"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtEstado"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtCiudad"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtCodigoPostal"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtPais"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtTelefono1"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtTelefono2"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtEmail"), true);
            sap.ui.getCore().getMessageManager().registerObject(oView.byId("txtReferencias"), true);

            oView.addEventDelegate({
                onBeforeShow: function () {
                    if (sap.ui.Device.system.phone) {
                        var oPage = oView.getContent()[0];
                        if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
                            oPage.setShowNavButton(true);
                            oPage.attachNavButtonPress(function () {
                                this.oRouter.navTo("Dialog_BuscarCliente", {}, true);
                            }.bind(this));
                        }
                    }
                }.bind(this)
            });
        },
        /**
         * Custom model type for validating an E-Mail address
         * @class
         * @extends sap.ui.model.SimpleType
         */
        customEMailType : SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                //parsing step takes place before validating step, value could be altered here
                return oValue;
            },
            validateValue: function (oValue) {
                // The following Regex is NOT a completely correct one and only used for demonstration purposes.
                // RFC 5322 cannot even checked by a Regex and the Regex for RFC 822 is very long and complex.
                var rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!oValue.match(rexMail)) {
                    throw new ValidateException("'" + oValue + "' no es una dirección de correo válida");
                }
            }
        })
    });
}, /* bExport= */true);
