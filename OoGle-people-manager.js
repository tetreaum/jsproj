// The API toolkit for making REST systems easily
const express = require('express');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');
// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');

// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on
const port = 3000;

 

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

// Build our routes

//Return all programmers
app.get('/all', (req, res) => res.json(database));

//Return a programmer by ID
app.get('/:id', function(req,res) {
  const id = req.params.id;
  var person = {};
  //Loop through database and match up SID with param id
  for(const slave of database){
	  if(slave.SID == id){
		person = slave;
	  }
  }
  res.send(person);
});

//Update an existing programmer
app.put('/:id', function(req, res) {
  const id = req.params.id;
  const body = req.body;
  var person = {};
  //Loop through database and match up SID with param id
  for(const slave of database){
	  if(slave.SID == id){
		  person = slave;
	  }
  }
  //Update attributes of programmer
  try {
	person.firstName = body.firstName;
	person.lastName = body.lastName;
	person.homeAddress = body.homeAddress;
	person.SID = body.SID;
	person.goodSlave = body.beatingsToDate;
	person.family = body.family;
  } catch (err) {
		console.log(err);
		res.send('Missing required values.');
  }
  res.send(person);
  res.sendStatus(200);
});

//Post a new programmer
app.post('/new', function(req, res) {
  const body = req.body; // Hold your JSON in here!
  console.log(body);
  database.push(body);
  res.send(`You sent: ${body}`);
  res.sendStatus(200);
  
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE
//Handle invalid routes
app.all('*', function(req, res) {
  //res.send('Route not found.');
  res.send('Valid routes are /all, /:id, and /new');
  try {
	  var err = new Error('Route not found.');
	  throw err;
  } catch (err) {
	  console.log(err);
  }
	  
});

app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});
