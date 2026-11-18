import cds from '@sap/cds';
import { rateLimit } from 'express-rate-limit';

// Rate limiting: each visitor (IP address) may send at most RATE_LIMIT requests
// per minute to the OData service. Normal use stays far below this; scripts that
// flood the app get HTTP 429 "Too Many Requests" until the minute is over.
const RATE_LIMIT = 100;

cds.on('bootstrap', app => {
    // On BTP the app runs behind SAP's routers, which pass the visitor's IP
    // in the X-Forwarded-For header. Trust it so each visitor is counted separately.
    app.set('trust proxy', true);

    app.use('/odata', rateLimit({
        windowMs: 60 * 1000,
        limit: RATE_LIMIT,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        validate: { trustProxy: false }, // we trust the proxy on purpose (see above)
        handler: (req, res) => res.status(429).json({
            error: { code: '429', message: 'Too many requests. Please wait a minute and try again.' }
        })
    }));
});

// Local development uses a SQLite file (db.sqlite) so data survives restarts.
// On the very first start the file has no tables yet: create them and load the
// demo data from db/data and test/data. Later starts keep the existing data.
// To start over with fresh demo data, run: npm run reset-data
cds.on('served', async () => {
    const db = cds.db;
    if (db?.options?.kind !== 'sqlite' || db.options.credentials?.url === ':memory:') return;
    const exists = await db.run(
        SELECT.one.from('sqlite_master').columns('name').where({ type: 'table', name: 'app_elearning_Catagories' })
    );
    if (!exists) {
        cds.log('db').info('First start: creating tables and loading demo data into', db.options.credentials.url);
        await cds.deploy('*').to(db);
    }
});

export default cds.server;
