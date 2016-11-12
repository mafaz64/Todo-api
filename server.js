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

//Now any time a json request comes in express will be able to parse it and we will be able to access it via req.body
app.use(bodyParser.json());

//GET todos?completed=true&q=work
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	//console.log(queryParams);

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		//The function where() returns the list of todos where competed is true. See underscodejs.org for details
		filteredTodos = _.where(filteredTodos, {completed:true});
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed:false});
	}

	//Use the filteredTodos and search for the items containg description matching the passed description for q value
	if(queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
		//The function filter() returns the list of todos where code in the anonymous function evalutes to true. See underscodejs.org for details
		filteredTodos = _.filter(filteredTodos, function (todo) {
			//Note the indexOf() function search in case sensitive so we used toLowerCase() function 
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1
			
		});
		
	}

	
	res.json(filteredTodos);
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

//DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id,10);
	var matchedTodo;

	//Find the todo item by id
	matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo) {
		//Delete the found item from list
		//console.log('about to delete matchedTodo');
		todos = _.without(todos, matchedTodo);
		//retun the deleted item
		return res.json(matchedTodo);
	} else {
		//return res.status(404).send('No match found for id: ' + todoId);
		res.status(404).json({"error": "No todo found with this id"});
	}
});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	//If no mathed item found just return error.
	if(!matchedTodo) {
		return res.status(404).json({"error":"No todo item found for passed id"});
	}

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		//Add to validAttributes
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		//Something is wrong
		return res.status(400).send();
	}

	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		//console.log('About to set description in validAttrubutes');
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		//Something is wrong
		console.log('Somthing went wrong');
		return res.status(400).send();
	}

	//Every thing seems to be in order. Update the todo item using extends method from underscore
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);

});




app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.listen(PORT, function(){
	console.log('Express server started listening on port ' + PORT + '!');
});