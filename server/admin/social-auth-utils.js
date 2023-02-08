const authorizedProviders = ["GOOGLE", "FACEBOOK", "TWITTER"];
const ObjectID = require("mongodb").ObjectID;


actualId = function(id) {
	if (typeof(id) !== "string")
		throw Error("Id must be a string");

	for (let provider of authorizedProviders)
		if (id.includes(provider))
			return id;

	return ObjectID(id);
};

module.exports = {
	authorizedProviders,
	actualId
};