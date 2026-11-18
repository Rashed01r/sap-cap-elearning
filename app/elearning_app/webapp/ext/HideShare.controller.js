sap.ui.define(["sap/ui/core/mvc/ControllerExtension"], function (ControllerExtension) {
    "use strict";

    /**
     * Hides the Fiori Elements "Share" button (Send Email, etc.).
     * The id "fe::Share" belongs to a wrapper control; the visible button inside
     * gets a generated id, so we tag that inner button with a CSS class.
     * A style class survives Fiori re-binding the button's "visible" property.
     */
    function hideShare(view) {
        if (!view) { return; }
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

    return ControllerExtension.extend("elearningapp.ext.HideShare", {
        override: {
            onAfterRendering: function () { hideShare(this.base.getView()); },
            onPageReady: function () { hideShare(this.base.getView()); }
        }
    });
});
