const therapistManagement = require("./therapistManagement.js");
const onErrorFullDelete = require("./onErrorFullDelete.js");

module.exports.connectTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];
		const therapistLogged = await therapistManagement.connectTherapist(therapist.email, therapist.password);

		if (!therapistLogged.success)
			await onErrorFullDelete(therapistLogged.message, therapistLogged.data);

		data_config.therapists[i].uid = therapistLogged.therapist.uid;
		data_config.therapists[i].accessToken = therapistLogged.therapist.accessToken;
		data_config.therapists[i].refreshToken = therapistLogged.therapist.refreshToken;
	}
};

module.exports.deleteTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];
		const therapistDeleted = await therapistManagement.deleteTherapist(therapist.accessToken);

		if (!therapistDeleted.success)
			await onErrorFullDelete(therapistDeleted.message, therapistDeleted.data);
	}
};