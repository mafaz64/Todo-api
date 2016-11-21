//When you have a file which is supposed to be called using sequelize.import(..)
//This is how it is supposed to be done.

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				//
				if (typeof(user.email) === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		}
	});
};