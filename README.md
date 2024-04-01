# mongo_import | a node app to import tracks from an xlsx file into MongoDB using mongoose

## How to use the app:

• make sure you have MongoDB, Node and npm installed on your system

• clone this repo to your system

• create a local Mongo database, or identify an existing one to import the data into

• add a `.env` file to the repo on your system and set your MongoDB connection string as env variables, named: `DB_URL_DEV` and `DB_URL_PRD`

_A DEV db is enough to use the app in the development environment._

• in the terminal, `cd` to the project folder, then run:
`npm install` to install the node packages

• run `npm run start-db` (this will run `mongod`, and only needs to be run once, not at every import attempt)

• to start a data import, run: 
`npm start "<path/to/file.xlsx>"` 

e.g. `npm start "./data/Test_Import.xlsx"`

• two xlsx files are included in the /data folder:
`Test_Import.xlsx` and `Track_Import_8.xlsx`

you can use these or you can import a different file on your system (by passing its path when calling the process).

• check the log for info and errors

• some tests are included and can be run via: `npm test`

• you can optionally delete all imported tracks running: 
`npm run delete`
