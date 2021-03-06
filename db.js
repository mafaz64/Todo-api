var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env ==='production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
	'dialect': 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}

//We will attach multiple properties with db object and eventual export it from db.js
var db = {};

//sequelize.import function lets you imort modules from another file
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
//Added sequelize instance
db.sequelize = sequelize;
//Added sequelize library
db.Sequelize = Sequelize;

//Adding associateion
db.todo.belongsTo(db.user);
//Adding association
db.user.hasMany(db.todo);

//This is how we can export multiple things from a file
//We will set object db with multiple models and export the db object
module.exports = db;

