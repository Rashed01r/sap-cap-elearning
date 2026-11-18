import cds from '@sap/cds';

/**
 * Maintains Catagories.status:
 *   - 'Draft'   while a category is being created or edited
 *   - 'Created' when a new category is saved for the first time
 *   - 'Updated' when an existing category is saved again
 */
export default class eLearning extends cds.ApplicationService {
    init() {
        const { Catagories } = this.entities;

        // New draft (user clicked "Create")
        this.before('NEW', Catagories.drafts, req => {
            req.data.status = 'Draft';
        });

        // Existing category opened for editing -> mark its draft copy
        this.after('EDIT', Catagories, async (draft) => {
            await UPDATE(Catagories.drafts, { id: draft.id }).with({ status: 'Draft' });
            draft.status = 'Draft';
        });

        // Draft saved -> Created (first save) or Updated (later saves)
        this.before('SAVE', Catagories, async req => {
            const exists = await SELECT.one.from(Catagories).columns('id').where({ id: req.data.id });
            req.data.status = exists ? 'Updated' : 'Created';
        });

        return super.init();
    }
}
