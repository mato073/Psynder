const sendRequest = require("./sendRequest.js");

module.exports.createSpecialty = async function(specialty, accessToken)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/specialties",
			headers: { 
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			data : JSON.stringify(specialty)
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status != 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, id: res.body.specialtyId});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

/*
module.exports.deleteSpecialty = async function(specialtyId)
{
	try {
		db.connect();
		if (!db.get())
			throw Error("Not connected to database");
	
		const res = await db.get().collection("Specialties").deleteOne({_id: ObjectID(specialtyId)});
		if (!res)
			throw Error("Error when deleting specialty from the database");

		db.close();

		return ({success: true, user: res.body});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};*/