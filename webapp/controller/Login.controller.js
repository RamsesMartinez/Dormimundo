
sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "./utilities",
  "sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
  "use strict";

  return BaseController.extend("com.sap.build.standard.dormimundo.controller.Login", {
    handleRouteMatched: function (oEvent) {
      var oParams = {};

      if (oEvent.mParameters.data.context) {
        this.sContext = oEvent.mParameters.data.context;
        var oPath;
        if (this.sContext) {
          oPath = {path: "/" + this.sContext, parameters: oParams};
          this.getView().bindObject(oPath);
        }
      }
      this.getView().getParent().getParent().setMode("HideMode");
    },

    /**
     * Función que permite recuperar el nombre del vendedor en caso de que el código de empleado exista
     * @param oEvent evento resultante del llamado a la función
     * @private
     */
    _onChangeUserCode: function (oEvent) {
      var oView = this.getView();
      var sUserCode = oEvent.getParameters().value;
      var sFullName = '';

      // Termina la funcion para no hacer petición ajax si el campo está vacío
      if (sUserCode === '') {
        // Cambia el valor del txtUserName
        oView.getModel().setProperty("/userName", "Nombre del agente");
        return;
      }

      $.ajax({
        method: 'POST',
        url: '/connect/session.php',
        data: {
          'type': 'userCode',
          'value': sUserCode
        },
        type: 'json',
        async: false,

        // On receive of reply
        success: function(result) {
          var employeeObject = JSON.parse(result);
          if (employeeObject.code !== 0) {
            console.log("sin resultados");
            oView.getModel().setProperty("/userName", "Nombre del agente");
            return;
          }

          sFullName = employeeObject.data[0].firstName + ' ' + employeeObject.data[0].lastName;

          oView.getModel().setProperty("/userName", sFullName);

        },
        error: function(err) {
          console.log('Error');
          console.log(err);
        }
      });
    },

    _onLiveChangeUserCode: function (oEvent) {
      var oView = this.getView();

      oView.byId('btnLogin').setEnabled(false);
      oView.byId('txtUserPassword').setValue('');
    },

    _onLiveChangePassword: function(oEvent) {
      var oView = this.getView();
      var sUserCode = oView.byId('txtUserCode').mProperties.value;
      var sUserName = oView.byId('txtUserName').mProperties.value;
      var sUserPassword = oEvent.getParameters().value;
      var btnLogin = oView.byId('btnLogin');

      // Cambia estado del btnLogin
      if (sUserCode === '' || sUserPassword === '' || sUserName === 'Nombre del agente') {
        btnLogin.setEnabled(false);
      } else {
        btnLogin.setEnabled(true);
      }
    },

    _onButtonLogin: function (oEvent) {
      var oView = this.getView();
      var sUserCode = oView.byId('txtUserCode').mProperties.value;
      var sUserPassword = oView.byId('txtUserPassword').mProperties.value;
      var sUserName = oView.byId('txtUserName').mProperties.value;

      // Valida si la contraseña y usuario son correctos
      $.ajax({
        method: 'POST',
        url: '/connect/session.php',
        type: 'json',
        async: false,
        data: {
          'type': 'start_session',
          'sUserCode': sUserCode,
          'sUserName': sUserName,
          'sUserPassword': sUserPassword
        },
        success: function (result) {
          var jsonResult = JSON.parse(result);
          if (jsonResult.session === true) {
            location.reload();
          } else {
            console.log(result);
            alert("Revisa tus credenciales de acceso");
          }
        },
        error: function (err) {
          console.log(err);
        }
      });

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
      this.oRouter.getTarget("Login").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

      var oView = this.getView();
      var sUserName = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("nombreEmpleadoLogin");

      var data = {
        'userCode': null,
        'userName': sUserName,
        'userPassword': null
      };

      var model = new sap.ui.model.json.JSONModel(data);

      oView.setModel(model);

      oView.addEventDelegate({
        onBeforeShow: function () {
          if (sap.ui.Device.system.phone) {
            var oPage = oView.getContent()[0];

            if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
              oPage.setShowNavButton(true);
              oPage.attachNavButtonPress(function () {
                this.oRouter.navTo("", {}, true);
              }.bind(this));
            }
          }
        }.bind(this)
      });
    }
  });
}, /* bExport= */true);
