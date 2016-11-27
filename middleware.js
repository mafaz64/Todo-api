module.exports = function(db) {

	//Return an abject
	return {
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth');
			db.user.findByToken(token).then(function(user) {
				//Set the found user in the req and call next which causes the private route to be run
				req.user = user;
				next();

			},
			function() {
				res.status(401).send();
			});
		}
	};

};