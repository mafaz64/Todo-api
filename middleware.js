var cryptojs = require('crypto-js');

module.exports = function(db) {

	//Return an object
	return {
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth') || '';

			//Find the token in DB
			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then (function(tokenInstance) {
				if(!tokenInstance) {
					throw new Error();
				}

				//Put the found token instance in request
				req.token = tokenInstance;

				return db.user.findByToken(token);
					
				}).then (function(user) {
					//Set the found user in the req and call next which causes the private route to be run
					req.user = user;
					next();
				}).catch (function() {
					res.status(401).send();
				});
		}
	};

};