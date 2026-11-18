using app.elearning from '../db/elearning';

service eLearning {

    @odata.draft.enabled
    entity Catagories as projection on elearning.Catagories;

    entity Courses as projection on elearning.Courses;

    @readonly
    entity StatusCodes as projection on elearning.StatusCodes;

    // App-wide settings for the UI (one record, no table).
    // readOnly = true on BTP (set in mta.yaml), false when run locally.
    @odata.singleton
    @cds.persistence.skip
    @readonly
    entity AppSettings {
        readOnly : Boolean;
    }

}
