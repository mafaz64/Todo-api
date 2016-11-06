var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var _ = require('underscore');
// var todos = [{
// 	id: 1,
// 	description: 'Meet mom for lunch',
// 	completed: false
// }, {
// 	id: 2,
// 	description: 'Go to super market',
// 	completed: false
// }, {
// 	id: 3,
// 	description: 'Pay MLGW bill',
// 	completed: true
// }];

//Now any time a json request comes in express will be able to parse it and we will be ablw to access it via req.body
app.use(bodyParser.json());

//GET todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

 //GET todos/:id
 app.get('/todos/:id', function (req, res) {
 	//Since req.params are strings by default converted it to int for comparision using parseInt
 	var todoId = parseInt(req.params.id,10);
 	var matchedTodo;

	//Now we will use functions from underscore. Documentation can be found at http://underscorejs.org/
	matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send('No match found for todo id of ' + todoId);
	}

 });

 //POST /todos
 app.post('/todos', function (req, res) {
 	var body = req.body;
 	//console.log('description: ' + body.description);
 	//Used underscore just to pick the data keys we want to use from the passed object
 	body = _.pick(body, 'description', 'completed');

 	//Doing data validation using functions from underscore
 	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
 		return res.status(400).send('Passed data is not valid,');
 	}
 	//Trim the description before we save it.
 	body.description = body.description.trim();
 	
 	body.id = todoNextId;

 	//todos.push({id: todoNextId, description: body.description, completed: body.completed});
 	todos.push(body);
 	//Increment the todoNextId
 	todoNextId++;
 	res.json(body);
 });

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.listen(PORT, function(){
	console.log('Express server started listening on port ' + PORT + '!');
});