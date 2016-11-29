//When you have a file which is supposed to be called using sequelize.import(..)
//This is how it is supposed to be done. Imported it in my db.js
var cryptojs = require ('crypto-js');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('token', {
		token: { 
			//Note: Using VIRUAL does not store the value in the tabel
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [1]
			},
			//Overing the set function so we can encrypt the token using MD5 algorithm and set the values
			set: function(value) {
				var hash = cryptojs.MD5(value).toString();
			this.setDataValue('token', value);
			this.setDataValue('tokenHash', hash);
			}
		},
		tokenHash: {
			type: DataTypes.STRING,
			allowNull: false
		}
		
	});
};