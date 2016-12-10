# CMSC495
```
NOTE:  Please reference the .gitignore file for the relevant files that should not be committed
```
## Dependencies
*  Node.js
* MySQL or MariaDB Instance


## Setup Directions
*  In order for the project to run you must create a config folder with  a default.json inside at the base of the project.
*  Add  a mySQL connection string named connection into the JSON file you just created. Example :
```
{
  "connection" : "mysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{SCHEMA}}"
}
```
* On your command line, go to the base project directory and run  ``npm install``
* If you are running locally you will need to change the url for the AJAX requests in ``score.js`` and ``Breakout.js``
so that they point to you local DB & project instance
* When completed, run ``npm start`` to run the project on port 3000 (you can change the port via environment variables if so desired)
* Enjoy ~

