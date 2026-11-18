# E-Learning App

A small SAP CAP (Node.js) + Fiori Elements app for managing course **categories** and their **courses**, built as a learning project for SAP BTP.

## Features

- List of categories with a **Status** filter (Created / Updated / Draft)
- Create, edit and delete categories (Fiori draft: Edit → Save / Discard)
- Courses table inside each category: add rows inline, edit or delete with the action icons
- Language picked from a dropdown

## Project structure

| Folder / file | Purpose |
|---|---|
| `db/` | Data model (`elearning.cds`) and code lists (`data/`) |
| `srv/` | OData service (`elearning_srv.cds`) and status logic (`elearning_srv.js`) |
| `app/elearning_app/` | Fiori Elements UI: annotations, manifest, extensions in `webapp/ext/` |
| `test/data/` | Sample data, loaded only when running locally |
| `mta.yaml` | Deployment descriptor for SAP BTP Cloud Foundry |
| `xs-security.json` | XSUAA security configuration |

## Run locally

```bash
npm install
cds watch
```

Open <http://localhost:4004/elearningapp/index.html>. Locally the app uses an in-memory SQLite database with the sample data from `test/data/`.

## Deploy to SAP BTP (Cloud Foundry)

```bash
cf login -a https://api.cf.<region>.hana.ondemand.com
npm run build
npm run deploy
```

Open the app from **BTP Cockpit → HTML5 Applications → elearningapp**.

On a **trial** account, SAP stops apps and the HANA Cloud database every night. Start them again with `cf start e_learning-srv` and from HANA Cloud Central.

To remove everything from BTP: `npm run undeploy`.
