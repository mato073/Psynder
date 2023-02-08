const specialtyManagement = require("./specialtyManagement.js");
const onErrorFullDelete = require("./onErrorFullDelete.js");

module.exports.createSpecialties = async function(therapistAccessToken)
{
	for (let i = 0; i < data_config.specialties.length; i++) {
		const specialty = data_config.specialties[i];
		const specialtyCreated = await specialtyManagement.createSpecialty(specialty, therapistAccessToken);

		if (!specialtyCreated.success)
			await onErrorFullDelete(specialtyCreated.message, specialtyCreated.data);

		data_config.specialties[i].id = specialtyCreated.id;
	}
};

module.exports.deleteSpecialties = async function()
{
	for (let i = 0; i < data_config.specialties.length; i++) {
		const specialtyId = data_config.specialties[i].id;
		const specialtyDeleted = await specialtyManagement.deleteSpecialty(specialtyId);

		if (!specialtyDeleted.success)
			await onErrorFullDelete(specialtyDeleted.message, specialtyDeleted.data);

		data_config.specialties[i].id = "";
	}
};