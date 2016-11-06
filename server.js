var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Pay MLGW bill',
	completed: true
}];

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
	// 	res.status(404).send('No match found for requested id');
	// }
	
	//res.send('Asking for todo with id of ' + req.params.id)
 });

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.listen(PORT, function(){
	console.log('Express server started listening on port ' + PORT + '!');
});