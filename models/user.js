//When you have a file which is supposed to be called using sequelize.import(..)
//This is how it is supposed to be done.
var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
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
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
						console.log('Got it');
						if (typeof body.email !== 'string' && body.email.length === 0 && typeof body.password !== 'string' && body.password.length === 0) {
							return reject();
						}

						var whereClause = {};
						whereClause.email = body.email.toLowerCase();

						user.findOne({
							where: whereClause
						}).then(function(user) {
							//Note: The bcrypt.compareSync function lets us compare the plain password with hashed password
							if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
								return reject();
							} 
							//console.log('Password Matched. Good to go');
							
							resolve(user);
							
						}, function(e) {
							reject(e);
						});


						});

					}
				},
				instanceMethods: {
					toPublicJSON: function() {
						//console.log('toPublicJSON is called');
						var json = this.toJSON();
						//Just pick the fields we want to show. We do not want to show salt, password_hash
						return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
					}
				}
	});

	return user;
};