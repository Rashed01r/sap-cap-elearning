# E-Learning App

A learning project built with **SAP CAP (Node.js)** and **SAP Fiori Elements**.
Manage course **categories** and the **courses** inside each one.

## Features

- Create, edit and delete categories and courses
- Status filter: Created / Updated / Draft
- Limits: max 10 categories, max 3 courses per category
- Rate limiting against spam

## Run it on your computer

```bash
npm install
cds watch
```

Then open <http://localhost:4004/elearningapp/index.html>.

### Where is the data saved?

Your data is saved in a small database file called **`db.sqlite`** in the project folder.

- **First start:** the file is created automatically and filled with demo data.
- **Your changes are kept**, even after you stop and restart the app.
- **Start over** with fresh demo data at any time:

  ```bash
  npm run reset-data
  ```

`db.sqlite` stays on your computer only. It is never uploaded to GitHub.

## Deploy to SAP BTP

```bash
cf login
npm run build
npm run deploy
```

The deployed app is a **read-only demo**: visitors can browse, but not change anything.
It uses SAP HANA Cloud instead of SQLite.

## Project structure

| Folder | What's inside |
|---|---|
| `db/` | Data model |
| `srv/` | Service and business rules |
| `app/` | Fiori UI |
| `test/data/` | Demo data |
