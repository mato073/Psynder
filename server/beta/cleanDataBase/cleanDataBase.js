
const onErrorFullDelete = require("./src/onErrorFullDelete.js");
const therapistsManagement = require("./src/therapistsManagement.js");
const usersManagement = require('./src/usersManagement');
const getLatestResultConfigFile = require("./src/getLatestResultConfigFile.js");

data_config = {};
async function main()
{
	try {
		data_config = getLatestResultConfigFile();

		await therapistsManagement.connectTherapists();
		console.log("Therapists connected to refresh tokens");
		await therapistsManagement.deleteTherapists();
		console.log("Therapists accounts deleted");
		
		await usersManagement.connectUsers();
		console.log("Users connected to refresh tokens");
		await usersManagement.deleteUsers();
		console.log("Users accounts deleted");

	} catch (exception) {
		await onErrorFullDelete(exception.stack);
	}
}

main();