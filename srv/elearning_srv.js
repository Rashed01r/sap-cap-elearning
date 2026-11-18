import cds from '@sap/cds';

// Limits to keep the learning app small and protect it from spam
const MAX_CATEGORIES = 10;
const MAX_COURSES_PER_CATEGORY = 3;

/**
 * - Maintains Catagories.status:
 *     'Draft'   while a category is being created or edited
 *     'Created' when a new category is saved for the first time
 *     'Updated' when an existing category is saved again
 * - Enforces MAX_CATEGORIES and MAX_COURSES_PER_CATEGORY
 */
export default class eLearning extends cds.ApplicationService {
    init() {
        const { Catagories, Courses } = this.entities;

        const countCategories = async () =>
            (await SELECT.one.from(Catagories).columns('count(*) as n')).n;

        const countDraftCourses = async (catagory_id) =>
            (await SELECT.one.from(Courses.drafts).columns('count(*) as n').where({ catagory_id })).n;

        // --- Create category (user clicked "Create") ---
        this.before('NEW', Catagories.drafts, async req => {
            if (await countCategories() >= MAX_CATEGORIES) {
                return req.reject(400, `You can have at most ${MAX_CATEGORIES} categories. Delete one before creating a new one.`);
            }
            req.data.status = 'Draft';
        });

        // --- Add course row inside a category ---
        this.before('NEW', Courses.drafts, async req => {
            if (await countDraftCourses(req.data.catagory_id) >= MAX_COURSES_PER_CATEGORY) {
                return req.reject(400, `A category can have at most ${MAX_COURSES_PER_CATEGORY} courses. Delete a course before adding a new one.`);
            }
        });

        // --- Course added to a saved category without editing it ("Create" pop-up) ---
        this.before('CREATE', Courses, async req => {
            const { n } = await SELECT.one.from(Courses).columns('count(*) as n').where({ catagory_id: req.data.catagory_id });
            if (n >= MAX_COURSES_PER_CATEGORY) {
                return req.reject(400, `A category can have at most ${MAX_COURSES_PER_CATEGORY} courses.`);
            }
        });
        this.after('CREATE', Courses, async (_result, req) => {
            // Adding a course changes the category -> mark it 'Updated'
            await UPDATE('app.elearning.Catagories', { id: req.data.catagory_id }).with({ status: 'Updated' });
        });

        // --- Existing category opened for editing -> mark its draft copy ---
        this.after('EDIT', Catagories, async (draft) => {
            await UPDATE(Catagories.drafts, { id: draft.id }).with({ status: 'Draft' });
            draft.status = 'Draft';
        });

        // --- Save: final check of both limits, then set Created / Updated ---
        this.before('SAVE', Catagories, async req => {
            const { id } = req.data;
            const exists = await SELECT.one.from(Catagories).columns('id').where({ id });

            if (!exists && await countCategories() >= MAX_CATEGORIES) {
                return req.reject(400, `You can have at most ${MAX_CATEGORIES} categories.`);
            }
            if (await countDraftCourses(id) > MAX_COURSES_PER_CATEGORY) {
                return req.reject(400, `A category can have at most ${MAX_COURSES_PER_CATEGORY} courses.`);
            }
            req.data.status = exists ? 'Updated' : 'Created';
        });

        return super.init();
    }
}
