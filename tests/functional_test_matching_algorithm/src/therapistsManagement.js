const therapistManagement = require("./therapistManagement.js");
const onErrorFullDelete = require("./onErrorFullDelete.js");
const util = require("util");

module.exports.createTherapists = async function()
{
	for (let i = 0; i < test_config.therapists.length; i++) {
		const therapist = test_config.therapists[i];
		const therapistCreated = await therapistManagement.createTherapist(therapist.email, therapist.password, therapist.firstName, therapist.lastName, therapist.phoneNumber);

		if (!therapistCreated.success)
			await onErrorFullDelete(therapistCreated.message, therapistCreated.data);
	}
};

module.exports.connectTherapists = async function()
{
	for (let i = 0; i < test_config.therapists.length; i++) {
		const therapist = test_config.therapists[i];
		const therapistLogged = await therapistManagement.connectTherapist(therapist.email, therapist.password);

		if (!therapistLogged.success)
			await onErrorFullDelete(therapistLogged.message, therapistLogged.data);

		test_config.therapists[i].uid = therapistLogged.therapist.uid;
		test_config.therapists[i].accessToken = therapistLogged.therapist.accessToken;
		test_config.therapists[i].refreshToken = therapistLogged.therapist.refreshToken;
	}
};

module.exports.deleteTherapists = async function()
{
	for (let i = 0; i < test_config.therapists.length; i++) {
		const therapist = test_config.therapists[i];
		const therapistDeleted = await therapistManagement.deleteTherapist(therapist.accessToken);

		if (!therapistDeleted.success)
			await onErrorFullDelete(therapistDeleted.message, therapistDeleted.data);
	}
};

module.exports.addSpecialtiesToTherapists = async function()
{
	for (let i = 0; i < test_config.therapists.length; i++) {
		const therapist = test_config.therapists[i];

		for (let j = 0; j < therapist.specialties.length; j++) {
			const specialty = test_config.specialties.find(sp => sp.name === therapist.specialties[j]);
			const therapistDeleted = await therapistManagement.addSpecialtyToTherapist(therapist.accessToken, specialty.id);

			if (!therapistDeleted.success)
				await onErrorFullDelete(therapistDeleted.message, therapistDeleted.data);
		}
	}
};

module.exports.addAlreadyTreatedDisordersToTherapists = async function()
{
	for (let i = 0; i < test_config.therapists.length; i++) {
		const therapist = test_config.therapists[i];

		for (let j = 0; j < therapist.alreadyTreated.length; j++) {
			const therapistDeleted = await therapistManagement.addAlreadyTreatedDisorderToTherapist(therapist.accessToken, therapist.alreadyTreated[j]);

			if (!therapistDeleted.success)
				await onErrorFullDelete(therapistDeleted.message, therapistDeleted.data);
		}
	}
};

module.exports.getCurrentTherapists = async function()
{
	for (let i = 0; i < test_config.therapists.length; i++) {
		const therapist = test_config.therapists[i];
		const therapistGet = await therapistManagement.getCurrentTherapist(therapist.accessToken);

		if (!therapistGet.success)
			await onErrorFullDelete(therapistGet.message, therapistGet.data);

		console.log(util.inspect(therapistGet.therapist, false, null, true /* enable colors */));
	}
};