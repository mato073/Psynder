const userManagement = require('./userManagement');
const onErrorFullDelete = require("./onErrorFullDelete.js");

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

module.exports.deleteUsers = async function()
{
	for (let i = 0; i < data_config.users.length; i++) {
		const user = data_config.users[i];
		const userDeleted = await userManagement.deleteUser(user.accessToken);

		if (!userDeleted.success)
			await onErrorFullDelete(userDeleted.message, userDeleted.data);
	}
};