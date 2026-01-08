sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"], function (Controller, History) {
    "use strict";

    return Controller.extend("ui5.product.list.controller.BaseController", {
        onNavBack: function () {
            const oHistory = History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                oRouter.navTo("home", {}, true);
            }
        },

        getRouter() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
})