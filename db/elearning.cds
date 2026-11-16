namespace app.elearning;
using { managed , Language } from '@sap/cds/common';


type String50: String(50);

entity Catagories {
    key id : UUID;
        name : String50;
        description : String(100);
        Courses : Association to many Courses on Courses.catagory = $self;

}


entity Courses : managed {
       key catagory : Association to Catagories;
       key course_id : UUID;
           course_name : String50;
           price : String(10);
           language : Language;
}



