sap.ui.define([], function () {
    "use strict";

    // Walk up from the pressed button to its view and return the page controller
    function getController(control) {
        while (control && !control.isA("sap.ui.core.mvc.View")) {
            control = control.getParent();
        }
        return control && control.getController();
    }

    return {
        // Pencil: open the course detail page (editable while the category is in Edit mode)
        onEdit: function (event) {
            var source = event.getSource();
            var context = source.getBindingContext();
            getController(source).getExtensionAPI().routing.navigate(context);
        },

        // Bin: delete the course, with Fiori's standard confirmation dialog
        onDelete: function (event) {
            var source = event.getSource();
            var context = source.getBindingContext();
            getController(source).editFlow.deleteDocument(context, {
                title: "Delete Course",
                description: context.getProperty("course_name")
            });
        }
    };
});
