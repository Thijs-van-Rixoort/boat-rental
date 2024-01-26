# backend
To initialize this back end on your system, run the following command in the terminal:
```bash
npm install

```
Once you have done that, open the following file in MySQL Workbench and forward engineer the ERD:
./src/util/database/mysql/het_vrolijke_avontuur_model.mwb

When you have created the database, create a user that has all permissions on that database.
Create a .env file in the root directory of this project and take a look at the .env_example.txt
to see what data you have to paste into it.

Once you have done this you should be ready to go. Start the back end by executing this command in 
the root directory of this repository:
```bash
npm start
```