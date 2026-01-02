sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/Sorter",
  "sap/ui/model/Filter",
  "ui5/product/list/model/models",
  "ui5/product/list/model/formatter"
], function (Controller, Fragment, Sorter, Filter, models, formatter) {
  "use strict";

  return Controller.extend("ui5.product.list.controller.App", {
    formatter: formatter,

    onPressCreateNewProduct() {
      const oData = this.getView().getModel("input").getData();

      if (!this._validate()) {
        return;
      }

      const oProductModel = this.getView().getModel("product");
      const aItems = oProductModel.getProperty("/items");

      aItems.push(oData);
      oProductModel.setProperty("/items", aItems);

      this._oCreteProductDialog.close();
    },

    OnPressDelete(oEvent) {
      const oItem = oEvent.getParameter("listItem");
      const oModel = this.getView().getModel("product");
      const iIndex = oItem
        .getBindingContext("product")
        .getPath()
        .split("/")
        .pop();

      oModel.getData().items.splice(iIndex, 1);
      oModel.refresh();
    },

    onPressAddNewProduct() {
      if (!this._oCreteProductDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "ui5.product.list.view.fragments.CreateProduct",
          controller: this
        }).then((oDialog) => {
          this._oCreteProductDialog = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this._oCreteProductDialog.open();
      }
    },

    onAfterCloseDialog() {
      this.getOwnerComponent().setModel(models.createInputModel(), "input");
      this.getOwnerComponent().setModel(models.createValidationModel(), "validation");
    },

    onPressCancelNewProduct() {
      this._oCreteProductDialog.close();
    },

    onSortButtonPressed() {
      if (!this._oSortDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "ui5.product.list.view.fragments.SortDialog",
          controller: this
        }).then((oDialog) => {
          this._oSortDialog = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this._oSortDialog.open();
      }
    },
    onFilterButtonPressed() {
      if (!this._oFilterDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "ui5.product.list.view.fragments.FilterDialog",
          controller: this
        }).then((oDialog) => {
          this._oFilterDialog = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this._oFilterDialog.open();
      }
    },

    onGroupButtonPressed() {
      if (!this._oGroupDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "ui5.product.list.view.fragments.GroupDialog",
          controller: this
        }).then((oDialog) => {
          this._oGroupDialog = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.open();
        });
      } else {
        this._oGroupDialog.open();
      }
    },

    onConfirmSort(oEvent) {
      const oSortItem = oEvent.getParameter("sortItem");
      const bDescending = oEvent.getParameter("descending");

      this.getView()
        .byId("idProductList")
        .getBinding("items")
        .sort(
          oSortItem
            ? [new Sorter(oSortItem.getKey(), bDescending)]
            : []
        );
    },

    onConfirmGroup(oEvent) {
      const oGroupItem = oEvent.getParameter("groupItem");
      const bDescending = oEvent.getParameter("groupDescending");

      this.getView()
        .byId("idProductList")
        .getBinding("items")
        .sort(oGroupItem ? [ new Sorter(oGroupItem.getKey(), bDescending, true)] : []);
    },

    onConfirmFilter(oEvent) {
      const aFilterItems = oEvent.getParameter("filterItems");
      const sFilterString = oEvent.getParameter("filterString");
      
      const aFilter = [];

      aFilterItems.forEach(item=> {
       const [sPath, sOperator, sValue1, sValue2] = item.getKey().split("__")
        aFilter.push(new Filter(sPath, sOperator, sValue1, sValue2));
      })

      this.getView()
        .byId("idProductList")
        .getBinding("items")
        .filter(aFilter);

        this.getView().byId("idFilterInfoToolbar").setVisible(aFilter.length ? true : false);
        this.getView().byId("idFilterText").setText(sFilterString);

    },

    _validate() {
      const oInputModel = this.getView().getModel("input").getData();
      const oValidationModel = this.getView().getModel("validation");

      oValidationModel.setProperty("/Name", !!oInputModel.Name);
      oValidationModel.setProperty("/Category", !!oInputModel.Category);
      oValidationModel.setProperty("/Price", !!oInputModel.Price);
      oValidationModel.setProperty("/ReleaseDate", !!oInputModel.ReleaseDate);

      return !Object.values(oValidationModel.getData()).includes(false);
    }
  });
});
