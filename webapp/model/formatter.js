sap.ui.define(["sap/ui/core/ValueState", "sap/m/GroupHeaderListItem"], function (ValueState, GroupHeaderListItem) {
    "use strict";
    return {
        formatAvailabilityText(sValue) {
            const oBundle = this.getView().getModel("i18n").getResourceBundle();

            return sValue && new Date(sValue) <= new Date() ? oBundle.getText("unavailable") : oBundle.getText("available")
        },

            formatAvailabilityState(sValue) {
          return sValue && new Date(sValue) <= new Date() ? ValueState.Error : ValueState.Success;
            },
  formatCategory(sValue) {
  return sValue || "Unknown";
},

formatGroupHeader(oGroup) {
  return new GroupHeaderListItem({
    title: oGroup.key || "Unknown"
  });
}


    }
});