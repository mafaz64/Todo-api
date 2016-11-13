var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

//We will attach multiple properties with db object and eventual export it from db.js
var db = {};

//sequelize.import function lets you imort modules from another file
db.todo = sequelize.import(__dirname + '/models/todo.js');
//Added sequelize instance
db.sequelize = sequelize;
//Added sequelize library
db.Sequelize = Sequelize;

//This is how we can export multiple things from a file
//We will set object db with multiple models and export the db object
module.exports = db;

