sap.ui.define(["sap/ui/core/mvc/ControllerExtension"], function (ControllerExtension) {
    "use strict";

    /**
     * Hides the Fiori Elements "Share" button (Send Email, etc.).
     * The id "fe::Share" belongs to a wrapper control; the visible button inside
     * gets a generated id, so we tag that inner button with a CSS class.
     * A style class survives Fiori re-binding the button's "visible" property.
     */
    function hideShare(view) {
        var buttons = [];
        var wrapper = view.byId("fe::Share");
        if (wrapper && wrapper.getContent && wrapper.getContent()) {
            buttons.push(wrapper.getContent());
        }
        // Fallback: any toolbar menu button using the "share" icon
        view.findAggregatedObjects(true, function (c) {
            return c.isA("sap.m.MenuButton") && c.getIcon && c.getIcon() === "sap-icon://action";
        }).forEach(function (b) { buttons.push(b); });

        buttons.forEach(function (b) {
            if (b.addStyleClass) { b.addStyleClass("elearningHideShare"); }
        });
    }

    /**
     * In the read-only demo (AppSettings.readOnly = true) nobody can edit or
     * delete courses, so the "Actions" column (edit / delete icons) is removed.
     */
    function removeActionsColumnIfReadOnly(view) {
        var model = view.getModel();
        if (!model || view.data("actionsColumnChecked")) { return; }
        view.data("actionsColumnChecked", true);

        model.bindContext("/AppSettings").requestObject().then(function (settings) {
            if (!settings || !settings.readOnly) { return; }
            view.findAggregatedObjects(true, function (c) {
                return c.isA("sap.ui.mdc.table.Column") && c.getHeader() === "Actions";
            }).forEach(function (column) {
                column.getParent().removeColumn(column);
                column.destroy();
            });
        }).catch(function () {
            view.data("actionsColumnChecked", false); // try again on the next page load
        });
    }

    function onPage(view) {
        if (!view) { return; }
        hideShare(view);
        removeActionsColumnIfReadOnly(view);
    }

    return ControllerExtension.extend("elearningapp.ext.PageExtension", {
        override: {
            onAfterRendering: function () { onPage(this.base.getView()); },
            onPageReady: function () { onPage(this.base.getView()); }
        }
    });
});
