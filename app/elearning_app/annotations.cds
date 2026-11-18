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
            @HTML5.CssDefaults : { width : '60rem' },
        },
    ],
);

annotate service.Catagories with {
    id          @UI.Hidden;
    name        @title : 'Name'        @mandatory;
    description @title : 'Description' @UI.MultiLineText;
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
    language    @title : 'Language';
};
