# Edit:
Another university group project. 

Disclaimer: Not all code written by me personally. 

# Client tests example

## Setup database
Create a MySQL developement and test database.
Run the SQL queries in the following files in the repository against your databases in MySQL.
- db-create-tables.sql
- db-create-usertables.sql
- db-insert-area.sql
- db-insert-categories.sql
- db-insert-ingredients.sql
- db-insert-measurements.sql


## Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_dev';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_test';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Run server tests:

```sh
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

### Run client tests:

```sh
npm test
```

## Credits
Git repo originally cloned from: https://gitlab.com/ntnu-dcst2002/todo-client-tests created by Ole Christian Eidheim.
