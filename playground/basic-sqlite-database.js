var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-databse.sqlite'
});

//Note: define() function takes two args. 'todo' is my model name and 
//then I provide an object whcih defines the structure of my todo
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})


//Note: define() function takes two args. 'user' is my model name and 
//then I provide an object whcih defines the structure of my user
var User = sequelize.define('user', {
	email: {
		type: Sequelize.STRING
	}
})

//Defining relations
Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	//Note: The following line force:true causes the table to be droped and recreated every time this program runs.
	//force: true
}).then(function() {
	console.log('Everything is synched');

	
//Change1: My change starts
//Create a user then create a task and associate the task with the user
	// User.create({
	// 	email: 'mafaz@excite.com'
	// }).then (function() {
	// 	return Todo.create({
	// 		description: 'Clean the yard.'
	// 	});
	// }).then (function(todo) {
	// 	User.findById(1).then(function(user) {
	// 		user.addTodo(todo);
			
	// 	});
	// });
//Change1: My change ends	

//Change2: My chamge starts
	User.findById(1).then(function(user) {
		var whereClause = {completed: true}
		user.getTodos({where: whereClause}).then(function(todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			});
		});
	});

//Change2: My chamge ends

	//return Todo.findById(2);

	// Todo.create({
	// 	description: 'Walk my dog',
	// 	completed: false
	// }).then(function(todo) {
	// 	// console.log('Finished!');
	// 	// console.log(todo.toJSON());
	// 	return Todo.create({
	// 		description: 'Clean office'
	// 	}).then(function() {
	// 		//return Todo.findById(1);
	// 		return Todo.findAll({
	// 			where: {
	// 				description: {
	// 					$like: '%my%'
	// 				}
	// 			}
	// 		})
	// 	}).then(function(todos) {
			
	// 		if(todos) {
	// 			todos.forEach(function(todo) {
	// 				console.log(todo.toJSON());
	// 			})
	// 		} else {
	// 			console.log('No todo found!');
	// 		}

	// 	})
	// }).catch(function(e) {
	// 		console.log(e);
	// });
}).then(function (todo) {
	if (todo) {
		console.log(todo.toJSON());
	} else {
		console.log('No todo item found!');
	}
});