namespace app.elearning;
using { managed , Language } from '@sap/cds/common';


type String50: String(50);

entity Catagories {
    key id : UUID;
        name : String50;
        description : String(100);
        status : String(10) default 'Created'; // Created | Updated | Draft (set in srv/elearning_srv.js)
        Courses : Composition of many Courses on Courses.catagory = $self;

}

// Code list for the Status filter dropdown
entity StatusCodes {
    key code : String(10);
}


entity Courses : managed {
       key catagory : Association to Catagories;
       key course_id : UUID;
           course_name : String50;
           price : String(10);
           language : Language;
}



