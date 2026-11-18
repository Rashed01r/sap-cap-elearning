sap.ui.define([], function () {
    "use strict";

    // Walk up from the pressed button to its view and return the page controller
    function getController(control) {
        var current = control;
        while (current && !current.isA("sap.ui.core.mvc.View")) {
            current = current.getParent();
        }
        return current && current.getController();
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
