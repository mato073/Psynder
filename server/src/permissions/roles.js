/* IMPORTANT */
/*
	These middlewares have to be put after "isAuthenticated" when used
*/

 // TODO: replace db queries by role check from token itself
exports.isUserNonTherapist = async(req, res, next) => {
	try {
		if (req.role !== "user")
			throw ("This user doesn't have the right role to be able to access the requested resource");
		next();
	} catch (err) {
		return res.status(401).json({
			"error": err.message
		});
	}
};


exports.isTherapist = async(req, res, next) => {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}

		if (req.role !== "therapist")
			throw ("This user doesn't have the right role to be able to access the requested resource");
		next();
	} catch (err) {
		return res.status(401).json({
			"error": err.message
		});
	}
};


exports.isAdmin = async(req, res, next) => {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}
		if (req.role !== "admin")
			throw ("This user doesn't have the right role to be able to access the requested resource");
		next();
	} catch (err) {
		return res.status(401).json({
			"error": err.message
		});
	}
}

exports.isUserOrAdmin = async(req, res, next) => {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}
		if (req.role !== "admin" && req.role !== 'user')
			throw ("This user doesn't have the right role to be able to access the requested resource");
		next();
	} catch (err) {
		return res.status(401).json({
			"error": err.message
		});
	}
}

exports.isTherapistOrAdmin = async(req, res, next) => {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}
		if (req.role !== "admin" && req.role !== 'therapist')
			throw ("This user doesn't have the right role to be able to access the requested resource");
		next();
	} catch (err) {
		return res.status(401).json({
			"error": err.message
		});
	}
}