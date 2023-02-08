const sendRequest = require("./sendRequest.js");

module.exports = async function(errorMessage, data = undefined)
{
	// await deleteTherapists();

	if (data != undefined)
		console.error(data, errorMessage);
	else
		console.error(errorMessage);

	process.exit(1);
};

async function deleteTherapists() {
	for (let i = 0; i < data_config.therapists.length; i++) {
		const accessToken = data_config.therapists[i].accessToken;
		if (!accessToken || accessToken === "")
			continue;
		const reqConfig = {
			method: "delete",
			url: "http://localhost:8080/therapists/current",
			headers: { 
				"Authorization": `Bearer ${accessToken}`
			}
		};
		await sendRequest(reqConfig);
	}
}

// async function deleteSpecialties() {
// 	for (let i = 0; i < config.specialties.length; i++) {
// 		const id = config.specialties[i].id;
// 		await db.get().collection("Specialties").deleteOne({_id: ObjectID(id)});
// 	}
// }

/*
// const db = require("../../../server/src/db.js");

module.exports = async function(errorMessage)
{
	// db.connect();
	// if (!db.get())
	// 	throw Error("Not connected to database");

	// await deleteUsers();
	// await deleteTherapists();
	// await deleteSpecialties();

	// db.close();

	console.error(errorMessage);
	process.exit(1);
};

async function deleteUsers() {
	for (let i = 0; i < config.users.length; i++) {
		const id = config.users[i].uid;
		if (!id || id === "")
			continue;
		await db.get().collection("Users").deleteOne({_id: ObjectID(id)});
	}
}

async function deleteTherapists() {
	for (let i = 0; i < config.therapists.length; i++) {
		const id = config.therapists[i].uid;
		if (!id || id === "")
			continue;
		await db.get().collection("Therapists").deleteOne({_id: ObjectID(id)});
	}
}

async function deleteSpecialties() {
	for (let i = 0; i < config.specialties.length; i++) {
		const id = config.specialties[i].id;
		if (!id || id === "")
			continue;
		await db.get().collection("Specialties").deleteOne({_id: ObjectID(id)});
	}
}
*/