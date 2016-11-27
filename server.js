var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
//Note: Since middleware.js has a function which takes db as arg we can pass it right here as shown on the line below
var middleware = require('./middleware.js')(db)

//Now any time a json request comes in express will be able to parse it and we will be able to access it via req.body
app.use(bodyParser.json());

//GET todos?completed=true&q=work
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var queryParams = req.query;
	var where = {};
	var filteredTodos = [];

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		where.completed = false;
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {
		where.description = {
			$like: '%' + queryParams.q + '%'
		}
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {

		// console.log(todos);
		if (todos) {
			res.json(todos);
		} else {
			res.status(404).send('Match not found');
		}
	}, function(e) {
		res.status(500).send();
	});

});

//GET todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	//Since req.params are strings by default converted it to int for comparision using parseInt
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		//Note: The double !! mark infornt of an object converts it to its boolean version.
		//If todo had a value first ! will flip in to FALSE then the second ! will flip it to TRUE
		//If todo is NULL then ! will flip it to TRUE and then the second ! will flip it to FALSE
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send('No match found for todo id of :' + todoId);
		}

	}, function(e) {
		res.status(500).send();
	});


});

//POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = req.body;
	//console.log('description: ' + body.description);
	//Used underscore just to pick the data keys we want to use from the passed object
	body = _.pick(body, 'description', 'completed');

	//Trim the description before we save it.
	body.description = body.description.trim();

	db.todo.create(body).then(function(todo) {
		//res.json(todo.toJSON());
		//Note: Since the method middleware.requireAuthentication returned a user in req we used it to add todo for the user 
		req.user.addTodo(todo).then(function() {
			//Called reload to make sure we get the todo from the db after the association with the user was added to it.
			return todo.reload();
		}).then(function(todo) {
			res.json(todo.toJSON());
		});
	}, function(e) {
		res.status(400).json(e);
	});

	//My soultion is shown below. It worked
	/*
	//My solution starts
	db.todo.create({ description: body.description,
		completed: body.completed
	}).then(function(todo) {
		console.log(todo.toJSON());
		res.status(200).json(todo);
	}).catch(function(e) {
		res.status(400).json(e);
	});
	//My solution ends 	*/

});

//DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	//Since req.params are strings by default converted it to int for comparision using parseInt
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});

		} else {
			//If every thing went well and no data is expected to be returned send status 204.
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});

	// //***MY solution starts
	// //I did it the following way and it also worked. Instructor showed the above solution
	// db.todo.findById(todoId).then(function(todo) {
	// 	//Note: The double !! mark infornt of an object converts it to its boolean version.
	// 	//If todo had a value first ! will flip in to FALSE then the second ! will flip it to TRUE
	// 	//If todo is NULL then ! will flip it to TRUE and then the second ! will flip it to FALSE
	// 	if (!!todo) {
	// 		todo.destroy();
	// 		//Retunr the object which was just deleted
	// 		res.json(todo.toJSON());
	// 	} else {
	// 		res.status(404).send('No match found for todo id of :' + todoId);
	// 	}
	// }, function(e) {
	// 	res.status(500).send();
	// });
	// //****My Solution ends

	//var matchedTodo;
	//Find the todo item by id
	// matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	//Delete the found item from list
	// 	//console.log('about to delete matchedTodo');
	// 	todos = _.without(todos, matchedTodo);
	// 	//retun the deleted item
	// 	return res.json(matchedTodo);
	// } else {
	// 	//return res.status(404).send('No match found for id: ' + todoId);
	// 	res.status(404).json({
	// 		"error": "No todo found with this id"
	// 	});
	// }
});

//PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		//Add to attributes
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		//console.log('About to set description in validAttrubutes');
		attributes.description = body.description;
	}

	//Now find by id
	db.todo.findById(todoId).then(function(todo) {
		//If record found update it
		if (todo) {
			todo.update(attributes).then(function(todo) {
				//Update function above retuns the instance which was updated.
				//Now return the updated instance with default status of 200
				res.json(todo.toJSON());
			}, function(e) {
				//Validation error will be sent back with status 400 (i.e. Bad Request)
				res.status(400).json(e);
			});
		} else {
			//Retunr status 404 (i.e. not found)
			res.status(404).send();
		}

	}, function() {
		res.status(500).send();
	});


});


//POST /users
app.post('/users', function(req, res) {
	var body = req.body;
	//console.log('email: ' + body.email);
	//Used underscore just to pick the data keys we want to use from the passed object
	body = _.pick(body, 'email', 'password');


	db.user.create(body).then(function(user) {
		//res.json(user.toJSON());
		//Commented the above line and called the instanceMethod of toPublicJSON in user.js
		//This allowed me to not send back salt and password_hash back to the user
		res.json(user.toPublicJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

//POST /users/login
app.post('/users/login', function(req, res) {
	var body = req.body;
	body = _.pick(body, 'email', 'password');

	//Call the class method to authenticate
	db.user.authenticate(body).then(function(user) {
		//res.json(user.toJSON());
		//Call instance method toPublicJSON() to show desired filed only.
		//res.json(user.toPublicJSON());
		var token = user.generateToken('authentication');

		if (token) {
			//To set a header in the response we call header. header takes two args
			// 1) key which we set to 'Auth' 2)value which we set to generated token
			res.header('Auth', user.generateToken('authentication')).json(user.toPublicJSON());
		} else {
			res.status(401).send();
		}


	}, function() {
		res.status(401).send();
	});

});

app.get('/', function(req, res) {
	res.send('Todo API Root');
});


db.sequelize.sync(
	//Note: Passing this object {force:true} to sync() method will cause the existing tables to be droped and recreated.
	{force:true}
).then(function() {
	app.listen(PORT, function() {
		console.log('Express server started listening on port ' + PORT + '!');
	});
});

// app.listen(PORT, function() {
// 	console.log('Express server started listening on port ' + PORT + '!');
// });