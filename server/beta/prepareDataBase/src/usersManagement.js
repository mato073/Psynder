const userManagement = require('./userManagement');
const onErrorFullDelete = require("./onErrorFullDelete.js");
const util = require("util");

module.exports.createUsers = async function() {
	for (let i = 0; i < data_config.users.length; i++) {
		const user = data_config.users[i];
		const userCreated = await userManagement.createUser(user.email, user.password, user.firstName, user.lastName, user.phoneNumber);
		if (!userCreated.success)
			await onErrorFullDelete(userCreated.message, userCreated.data);
	}
};

module.exports.connectUsers= async function()
{
	for (let i = 0; i < data_config.users.length; i++) {
		const user = data_config.users[i];
		const userLogged = await userManagement.connectUser(user.email, user.password);

		if (!userLogged.success)
			await onErrorFullDelete(userLogged.message, userLogged.data);

		data_config.users[i].uid = userLogged.user.uid;
		data_config.users[i].accessToken = userLogged.user.accessToken;
		data_config.users[i].refreshToken = userLogged.user.refreshToken;
	}
};
