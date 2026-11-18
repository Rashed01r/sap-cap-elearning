using app.elearning from '../db/elearning';

service eLearning {

    @odata.draft.enabled
    entity Catagories as projection on elearning.Catagories;

    entity Courses as projection on elearning.Courses;

}
