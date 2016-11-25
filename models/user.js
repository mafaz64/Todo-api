//When you have a file which is supposed to be called using sequelize.import(..)
//This is how it is supposed to be done.
var bcrypt = require('bcrypt');
var _ = require('underscore');
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
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			//Note: DataTypes.VIRTUAL is not stored in the database but it is available
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				//Note: 10 is the number of characters we want for our salt is passed to method getSaltSync
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
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
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
};