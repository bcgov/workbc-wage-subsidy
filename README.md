![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)
# WorkBC Wage Subsidy

## Overview

Wage subsidy portal for application intake and management.

## Architecture Overview

The application consist of the following 6 clients and APIs:

- `./packages/static` : React single page application created with vite serving as a landing page for both applications
- `./packages/admin-client` : react-admin application for managing applications
- `./packages/admin-api` : expressjs API for CRUD operations on the database, with PDF capabilities using CDOGS
- `./packages/employer-client` : react-admin application for application intake, connected to CHEFS
- `./packages/employer-api` : expressjs API for CRUD operations on the database
- `./packages/form-api` : expressjs API for location services and emailing using CHES

## Deployment Flow

The GitHub repo is split into 3 main branches:
- dev
- test
- prod

They are protected branches and cannot be directly commited to. Any contributions will have to be made in a separate branch and through a Pull Request.

There are GitHub Actions created to build the image and push it with the appropriate tag to Docker Hub and OpenShift for deployment into the appropriate environment.

**Requirements for Pull Request:**
- All Unit Tests passes
- SonarCloud assessment passed

# Setting up for local development

**Required Dependancies on first open:**

- [Node 18.16.0 LTS](https://nodejs.org/en/download)

Run the following command first:

`npm install`

## Setting up Postgres database

Required dependencies:

 - [Postgres](https://hub.docker.com/_/postgres)
 - [Docker](https://www.docker.com/)

Proceed to pull the latest Postgres image and start a new Container with the image. Continue to run the following command to create a new Postgres instance.

```
docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=myuser -p 5432:5432 -d postgres
```

From this command you can proceed to create a `.env` file within `./SQL` with the following required environment variables:

```
PG_HOST
PG_PORT
PG_USER
PG_PASSWORD
PG_DB_NAME
```

Run the following command in the `./SQL` folder:

```
npx knex migrate:latest
```

This will create the database based on the schema provided in the `./SQL/createTables.sql`

## Setting up the clients and APIs

## License

```
Copyright 2022 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
