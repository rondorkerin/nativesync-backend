module.exports = function(req) {
	if (req.user.company == true) { 
		return req.body.clientID 
	} else {
		return req.user.id;	
	}
}
