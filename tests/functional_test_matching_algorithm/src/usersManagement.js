const onErrorFullDelete = require("./onErrorFullDelete.js");
const userManagement = require("./userManagement.js");
const util = require("util");

module.exports.createUsers = async function()
{
	for (let i = 0; i < test_config.users.length; i++) {
		const user = test_config.users[i];
		const userCreated = await userManagement.createUser(user.email, user.password, user.firstName, user.lastName, user.phoneNumber);

		if (!userCreated.success)
			await onErrorFullDelete(userCreated.message, userCreated.data);
	}
};

module.exports.connectUsers = async function()
{
	for (let i = 0; i < test_config.users.length; i++) {
		const user = test_config.users[i];
		const userLogged = await userManagement.connectUser(user.email, user.password);

		if (!userLogged.success)
			await onErrorFullDelete(userLogged.message, userLogged.data);

		test_config.users[i].uid = userLogged.user.uid;
		test_config.users[i].accessToken = userLogged.user.accessToken;
		test_config.users[i].refreshToken = userLogged.user.refreshToken;
	}
};

module.exports.deleteUsers = async function()
{
	for (let i = 0; i < test_config.users.length; i++) {
		const user = test_config.users[i];
		const userDeleted = await userManagement.deleteUser(user.accessToken);

		if (!userDeleted.success)
			await onErrorFullDelete(userDeleted.message, userDeleted.data);
	}
};

module.exports.sendResultsOfPotentialDisorders = async function()
{
	for (let i = 0; i < test_config.users.length; i++) {
		const user = test_config.users[i];

		for (let j = 0; j < user.surveys.length; j++) {
			const results = await userManagement.sendResultsOfPotentialDisorders(user.accessToken, user.surveys[j]);
			if (!results.success)
				await onErrorFullDelete(results.message, results.data);
		}
	}
};

module.exports.getMatchingResults = async function()
{
	for (let i = 0; i < test_config.users.length; i++) {
		const user = test_config.users[i];

		const results = await userManagement.getMatchingResults(user.accessToken);
		if (!results.success)
			await onErrorFullDelete(results.message, results.data);

		console.log(`\n - Matching results of '\x1b[33m${user.lastName} ${user.firstName}\x1b[0m':`);
		if (!results.results || !results.results.length) {
			console.log(`\tThere is no mathing with therapists`);
			continue;
		}

		for (let j = 0; j < results.results.length; j++) {
			const therapist = test_config.therapists.find(th => th.uid === results.results[j].therapistId);
			console.log(`\tIs \x1b[31m${results.results[j].matchingPercentage}%\x1b[0m compatible with '\x1b[36m${therapist.lastName} ${therapist.firstName}\x1b[0m'`);
		}
	}
};

module.exports.getCurrentUsers = async function()
{
	for (let i = 0; i < test_config.users.length; i++) {
		const user = test_config.users[i];
		const userGet = await userManagement.getCurrentUser(user.accessToken);

		if (!userGet.success)
			await onErrorFullDelete(userGet.message, userGet.data);

		console.log(util.inspect(userGet.user, false, null, true /* enable colors */));
	}
};