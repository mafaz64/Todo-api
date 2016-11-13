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


sequelize.sync({
	//Note: The following line force:true causes the table to be droped and recreated every time this program runs.
	//force: true
}).then(function() {
	console.log('Everything is synched');

	return Todo.findById(2);

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