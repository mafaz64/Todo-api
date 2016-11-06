var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
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
 	var matchFound = false;
 	//console.log('Requested todo id is:' + todoId);

	for (i = 0; i < todos.length; i++) {
		//console.log('In for loop todo['+ i +']: ' + todos[i].id);
		if (todos[i].id === todoId) {
			matchFound = true;
			//console.log('Match found with todo['+i+']');
			res.json(todos[i]);
			break;
		}
	}
	
	if(!matchFound) {
		res.status(404).send('No match found for todoId of ' + todoId);
	}

	//NOTE: The course used the forEach loop shown below
	// var matchedTodo;
	// todos.forEach(function(todo) {
	// 	if(todoId === todo.id) {
	// 		matchedTodo = todo;
	// 	}
	// });

	// if(matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send('No match found for todo id of ' + todoId);
	// }
	
	//res.send('Asking for todo with id of ' + req.params.id)
 });

 //POST /todos
 app.post('/todos', function (req, res) {
 	var body = req.body;
 	//console.log('description: ' + body.description);
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