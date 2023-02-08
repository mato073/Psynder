
test_config = require("./test_config.json");
const onErrorFullDelete = require("./src/onErrorFullDelete.js");
const usersManagement = require("./src/usersManagement.js");
const therapistsManagement = require("./src/therapistsManagement.js");
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

		await usersManagement.createUsers();
		console.log("User accounts created");
		await usersManagement.connectUsers();
		console.log("Users connected");
		await usersManagement.sendResultsOfPotentialDisorders();
		console.log("Potential disorders added to each user");

		await therapistsManagement.createTherapists();
		console.log("Therapists accounts created");
		const resActivationTherapistsAccounts = await adminManagement.activateTherapists();
		if (!resActivationTherapistsAccounts.success) {
			console.error(resActivationTherapistsAccounts.message);
			process.exit(1);
		}
		console.log("Therapists accounts unlocked");
		await therapistsManagement.connectTherapists();
		console.log("Therapists connected");

		await specialtiesManagement.createSpecialties(test_config.therapists[0].accessToken);
		console.log("Specialties created");
		await therapistsManagement.addSpecialtiesToTherapists();
		console.log("Specialties added to therapists");
		await therapistsManagement.addAlreadyTreatedDisordersToTherapists();
		console.log("Added already treated disorders to therapists");


		await usersManagement.getMatchingResults();
		// display mathing results of each user

		// await usersManagement.getCurrentUsers();
		/* display all information of each user */
		// await therapistsManagement.getCurrentTherapists();
		/* display all information of each therapist */

		await usersManagement.deleteUsers();
		console.log("Users deleted");
		await therapistsManagement.deleteTherapists();
		console.log("Therapists deleted");
		// await specialtiesManagement.deleteSpecialties(); // besoin de la route et des droits pour delete les spécialités
	} catch (exception) {
		await onErrorFullDelete(exception.stack);
	}
}

main();

//TODO dans la fonction qui en cas d'erreur delete tous les users et therapists, et à la fin de ce test, aussi delete specialties créés