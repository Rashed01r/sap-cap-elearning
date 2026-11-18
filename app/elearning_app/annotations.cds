using eLearning as service from '../../srv/elearning_srv';

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
annotate service.Catagories with @(
    UI.HeaderInfo : {
        TypeName       : 'Category',
        TypeNamePlural : 'Categories',
        Title          : { $Type : 'UI.DataField', Value : name },
        Description    : { $Type : 'UI.DataField', Value : description },
    },
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status,
            },
        ],
    },
    UI.FieldGroup #Description : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'DescriptionFacet',
            Label : 'Description',
            Target : '@UI.FieldGroup#Description',
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'CoursesFacet',
            Label : 'Courses',
            Target : 'Courses/@UI.LineItem',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Name',
            Value : name,
            @HTML5.CssDefaults : { width : '20rem' },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Description',
            Value : description,
            @HTML5.CssDefaults : { width : '50rem' },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status,
            @HTML5.CssDefaults : { width : '8rem' },
        },
    ],
    UI.SelectionFields : [ status ],

    // Hide Fiori's built-in "Editing Status" filter (replaced by our Status filter)
    Capabilities.NavigationRestrictions : {
        RestrictedProperties : [{
            NavigationProperty : DraftAdministrativeData,
            FilterRestrictions : { Filterable : false },
        }],
    },
);

annotate service.Catagories with {
    id          @UI.Hidden;
    name        @title : 'Name'        @mandatory;
    description @title : 'Description' @UI.MultiLineText;
    status      @title : 'Status'      @readonly
                @Common.ValueListWithFixedValues
                @Common.ValueList : {
                    CollectionPath : 'StatusCodes',
                    Parameters : [{
                        $Type : 'Common.ValueListParameterInOut',
                        LocalDataProperty : status,
                        ValueListProperty : 'code',
                    }],
                };
};

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------
annotate service.Courses with @(
    UI.HeaderInfo : {
        TypeName       : 'Course',
        TypeNamePlural : 'Courses',
        Title          : { $Type : 'UI.DataField', Value : course_name },
    },
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Course Name',
            Value : course_name,
            @HTML5.CssDefaults : { width : '30rem' },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Price',
            Value : price,
            @HTML5.CssDefaults : { width : '10rem' },
        },
        {
            $Type : 'UI.DataField',
            Label : 'Language',
            Value : language_code,
            @HTML5.CssDefaults : { width : '12rem' },
        },
    ],
    UI.FieldGroup #CourseDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'Course Name', Value : course_name },
            { $Type : 'UI.DataField', Label : 'Price',       Value : price },
            { $Type : 'UI.DataField', Label : 'Language',    Value : language_code },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'CourseDetailsFacet',
            Label : 'Course Details',
            Target : '@UI.FieldGroup#CourseDetails',
        },
    ],
);

annotate service.Courses with {
    course_id   @UI.Hidden;
    catagory    @UI.Hidden;
    course_name @title : 'Course Name' @mandatory;
    price       @title : 'Price';
    language    @title : 'Language'
                @Common.ValueListWithFixedValues
                @Common.Text : language.name
                @Common.TextArrangement : #TextOnly;
};

// ---------------------------------------------------------------------------
// Read-only demo: hide Create / Edit / Delete when AppSettings.readOnly = true
// ---------------------------------------------------------------------------
annotate service.Catagories with @(
    UI.CreateHidden : { $edmJson : { $Path : '/eLearning.EntityContainer/AppSettings/readOnly' } },
    UI.UpdateHidden : { $edmJson : { $Path : '/eLearning.EntityContainer/AppSettings/readOnly' } },
    UI.DeleteHidden : { $edmJson : { $Path : '/eLearning.EntityContainer/AppSettings/readOnly' } },
);
