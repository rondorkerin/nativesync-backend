## Step 1 - Required packages
Install rethinkdb, node, npm (subpackage of node), redis via brew
### Install "n", which is node version manager
`npm install -g n`
Switch to node 6.5.0 (bug in 6.6 right now)

### Install nodemon 
`npm install -g nodemon` 
So you dont have to restart node all the time

## Step 2 - npm install dependencies
`npm install` in base directory

## Step 3 - init the DB schema
run `node db/init.js`

This inits the schema + seeds the DB with test data



## Step 5 - run the app
`node app.js`




