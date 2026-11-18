sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/VBox",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/ListItem"
// eslint-disable-next-line max-params -- one parameter per loaded UI5 module
], function (Dialog, Button, Label, Input, Select, VBox, MessageToast, MessageBox, ListItem) {
    "use strict";

    // Small form used by "Create" when the category is NOT in edit mode
    function openCreateDialog(extensionAPI, categoryContext, listBinding) {
        var model = categoryContext.getModel();
        var nameInput = new Input({ id: "addCourseName", maxLength: 50, required: true });
        var priceInput = new Input({ id: "addCoursePrice", maxLength: 10 });
        var languageSelect = new Select({
            id: "addCourseLanguage",
            width: "100%",
            selectedKey: "en",
            items: { path: "/Languages", template: new ListItem({ key: "{code}", text: "{name}" }) }
        });

        var dialog = new Dialog({
            title: "New Course",
            contentWidth: "24rem",
            content: new VBox({
                items: [
                    new Label({ text: "Course Name", labelFor: nameInput, required: true }), nameInput,
                    new Label({ text: "Price", labelFor: priceInput }), priceInput,
                    new Label({ text: "Language", labelFor: languageSelect }), languageSelect
                ]
            }).addStyleClass("sapUiSmallMargin"),
            beginButton: new Button({
                text: "Save",
                type: "Emphasized",
                press: function () {
                    var name = nameInput.getValue().trim();
                    if (!name) {
                        nameInput.setValueState("Error").setValueStateText("Enter a course name.");
                        return;
                    }
                    dialog.setBusy(true);
                    // POST directly to the saved category: /Catagories(...)/Courses
                    var url = model.getServiceUrl() + categoryContext.getPath().substring(1) + "/Courses";
                    fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Accept": "application/json" },
                        body: JSON.stringify({
                            "course_name": name,
                            "price": priceInput.getValue().trim() || null,
                            "language_code": languageSelect.getSelectedKey() || null
                        })
                    }).then(function (response) {
                        if (response.ok) {
                            dialog.close();
                            MessageToast.show("Course added");
                            listBinding.refresh();
                            categoryContext.requestSideEffects(["status"]).catch(function () { /* status refreshes on next load */ });
                            return null;
                        }
                        return response.json().catch(function () { return {}; }).then(function (body) {
                            MessageBox.error((body.error && body.error.message) || "The course could not be added. Please try again.");
                        });
                    }).catch(function () {
                        MessageBox.error("The course could not be added. Check your connection and try again.");
                    }).finally(function () {
                        dialog.setBusy(false);
                    });
                }
            }),
            endButton: new Button({ text: "Cancel", press: function () { dialog.close(); } }),
            afterClose: function () { dialog.destroy(); }
        });

        extensionAPI.addDependent(dialog); // gives the dialog access to the app's data model
        dialog.open();
    }

    // Walk up from the pressed button to its view and return the page controller
    function getController(control) {
        var current = control;
        while (current && !current.isA("sap.ui.core.mvc.View")) {
            current = current.getParent();
        }
        return current && current.getController();
    }

    return {
        // "Create" button shown while the category is NOT in edit mode.
        // Fiori calls custom actions with this = ExtensionAPI and
        // (pageContext, selectedContexts, tableListBinding).
        onCreateInDisplay: function (pageContext, selectedContexts, listBinding) {
            openCreateDialog(this, pageContext, listBinding);
        },

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
