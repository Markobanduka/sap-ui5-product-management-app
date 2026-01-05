sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/Sorter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Context",
  "sap/m/MessageBox",
  "ui5/product/list/model/models",
  "ui5/product/list/model/formatter"
], function (Controller, Fragment, Sorter, Filter, FilterOperator, Context, MessageBox, models, formatter) {
  "use strict";

  return Controller.extend("ui5.product.list.controller.App", {
    formatter: formatter,

    onPressCreateNewProduct() {
      const oPayload = this.getView().getModel("input").getData();

      if (!this._validate()) {
        return;
      }

      oPayload.ID = Date.now().toString().slice(-4);
      delete oPayload.Category
      delete oPayload.Currency

      this.getView().getModel().create("/Products", oPayload, {
        success: (oData, oResponse) => {
          console.log(oData, oResponse)
          this._oCreteProductDialog.close();
        },
        error: oError => {
          console.error(oError);
          this._oCreteProductDialog
        }
      });
    },

    onItemPress(oEvent) {
      const oModel = this.getView().getModel();
      const ID = oEvent.getSource().getBindingContext().getProperty("ID");
      const sPath = oModel.createKey("/Products", {
        ID
       });

      // oModel.read(sPath, {
      //   success: oData => {
      //   MessageBox.show(oData.Description, {
      //     title:"Description"
      //   })
      //   },
      // })


      // MessageBox.show(oModel.getProperty(`${sPath}/Description`), {
      //     title:"Description"
      //   })


      if(!this._oEditDialog) {
        Fragment.load({
          id: this.getView().getId(),
          name: "ui5.product.list.view.fragments.Edit",
          controller: this
        }).then(oDialog => {
          this._oEditDialog = oDialog;
          this.getView().addDependent(oDialog);
          this._oEditDialog.setBindingContext(new Context(oModel, sPath));
          oDialog.open();
        })
      } else {
        this._oEditDialog.open();
      }

    },


    onPressCancelEditProduct() {
      this._oEditDialog.close();
    },

    onPressUpdateProduct() {
      const oView = this.getView();
      const oModel = this.getView().getModel();
      const sPath = this._oEditDialog.getBindingContext().getPath();

      const oPayload = {
        Name: oView.byId("idEditProductName").getValue(),
        Price: oView.byId("idEditPrice").getValue(),
        ReleaseDate: oView.byId("idEditReleaseDate").getDateValue(),
        DiscontinuedDate: oView.byId("idEditDiscontinuedDate").getDateValue(),
        Rating: oView.byId("idEditRating").getValue()
      }
      oModel.update(sPath, oPayload, {
        success: oData => {
          MessageBox.show("Product updated successfully");
          this._oEditDialog.close();
        },
        error: ()=> {
          MessageBox.error("Error updating product");
          this._oEditDialog.close();

        }
      })

    },

    OnPressDelete(oEvent) {
      const oModel = this.getView().getModel()
      const oItem = oEvent.getParameter("listItem");

      const sPath = oModel.createKey("/Products", {
        ID: oItem.getBindingContext().getProperty("ID")
      })

      oModel.remove(sPath, {
        success: () => {},
        error: ()=> {},

      })
  
    },

    onPressAddNewProduct() {
      if (!this._oCreteProductDialog) {
         this._loadDialog("CreateProduct").then((oDialog) => {
          this._oCreteProductDialog = oDialog;
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
        this._loadDialog("SortDialog").then((oDialog) => {
          this._oSortDialog = oDialog;
          oDialog.open();
        });
      } else {
        this._oSortDialog.open();
      }
    },
    onFilterButtonPressed() {
      if (!this._oFilterDialog) {
        this._loadDialog("FilterDialog").then((oDialog) => {
          this._oFilterDialog = oDialog;
          oDialog.open();
        });
     
      } else {
        this._oFilterDialog.open();
      }
    },

    onGroupButtonPressed() {
      if (!this._oGroupDialog) {
         this._loadDialog("GroupDialog").then((oDialog) => {
          this._oGroupDialog = oDialog;
          oDialog.open();
        });
      } else {
        this._oGroupDialog.open();
      }
    },

    onConfirmSort(oEvent) {
      const oSortItem = oEvent.getParameter("sortItem");
      const bDescending = oEvent.getParameter("sortDescending");

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
      const aFilterKeys= oEvent.getParameter("filterCompoundKeys");
      const sFilterString = oEvent.getParameter("filterString");
      
      const aFilter = [];

     Object.entries(aFilterKeys).forEach(([sPath, oValues]) => {
      Object.keys(oValues).forEach(sKey => {
        if(sKey.includes("__")) {
          aFilter.push(new Filter(...sKey.split("__")))
          } else {
            aFilter.push(new Filter(sPath, FilterOperator.EQ, sKey))
          }
        })
      })


      this.getView()
        .byId("idProductList")
        .getBinding("items")
        .filter(aFilter);

        this.getView().byId("idFilterInfoToolbar").setVisible(aFilter.length ? true : false);
        this.getView().byId("idFilterText").setText(sFilterString);

    },

    onProductsLoaded(oEvent) {
      const sTile = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("listHeader")

      this.getView().byId("idListTitle").setText(`${sTile} (${oEvent.getParameter("total")})`);
    },


    _validate() {
      const oInputModel = this.getView().getModel("input").getData();
      const oValidationModel = this.getView().getModel("validation");

      oValidationModel.setProperty("/Name", !!oInputModel.Name);
      oValidationModel.setProperty("/Category", !!oInputModel.Category);
      oValidationModel.setProperty("/Price", !!oInputModel.Price);
      oValidationModel.setProperty("/ReleaseDate", !!oInputModel.ReleaseDate);

      return !Object.values(oValidationModel.getData()).includes(false);
    },

    _loadDialog(sFragmentName) {
      return new Promise((resolve, reject) => {

        Fragment.load({
          id: this.getView().getId(),
          name: `ui5.product.list.view.fragments.${sFragmentName}`,
          controller: this
        }).then((oDialog) => {
          this.getView().addDependent(oDialog);
          resolve(oDialog);
        })
      });
      }
    });
});
