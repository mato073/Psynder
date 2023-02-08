
data_config = require("./data_config.json");
const fs = require('fs');
const onErrorFullDelete = require("./src/onErrorFullDelete.js");
const therapistsManagement = require("./src/therapistsManagement.js");
// const usersManagement = require('./src/usersManagement');
const specialtiesManagement = require("./src/specialtiesManagement.js");
const adminManagement = require("./src/adminManagement.js");

async function main()
{
	try {
		const resGettingAdminToken = await adminManagement.getToken();
		if (!resGettingAdminToken.success) {
			console.error(resGettingAdminToken.message);
			process.exit(1);
		}

		await therapistsManagement.createTherapists();
		console.log("Therapists accounts created");
		const resActivationTherapistsAccounts = await adminManagement.activateTherapists();
		if (!resActivationTherapistsAccounts.success) {
			console.error(resActivationTherapistsAccounts.message);
			process.exit(1);
		}
		console.log("Therapists accounts unlocked");
		await therapistsManagement.connectTherapists();
		console.log("Therapists accounts connected");

		// await usersManagement.createUsers();
		// console.log("Users accounts created");
		// await usersManagement.connectUsers();
		// console.log("Users accounts connected");

		await specialtiesManagement.createSpecialties(data_config.therapists[0].accessToken);
		console.log("Specialties created");
		await therapistsManagement.addSpecialtiesToTherapists();
		console.log("Specialties added to therapists");
		await therapistsManagement.addAlreadyTreatedDisordersToTherapists();
		console.log("Added already treated disorders to therapists");
		await therapistsManagement.addLocationsToTherapists();

		// save JSON as its actual filled state
		try {
			const data = JSON.stringify(data_config, null, 4);
			const date = (new Date().toISOString()).replace(/:/g, "-");
			fs.writeFileSync(`./results/${date}.json`, data);
			console.log("JSON data is saved.");
		} catch (err) {
			console.error("\n", err.stack, "\nBut therapists and specialties will not be removed\n");
		}
	} catch (exception) {
		await onErrorFullDelete(exception.stack);
	}
}

main();