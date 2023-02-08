const specialtyManagement = require("./specialtyManagement.js");
const onErrorFullDelete = require("./onErrorFullDelete.js");

module.exports.createSpecialties = async function(therapistAccessToken)
{
	for (let i = 0; i < test_config.specialties.length; i++) {
		const specialty = test_config.specialties[i];
		const specialtyCreated = await specialtyManagement.createSpecialty(specialty, therapistAccessToken);

		if (!specialtyCreated.success)
			await onErrorFullDelete(specialtyCreated.message, specialtyCreated.data);

		test_config.specialties[i].id = specialtyCreated.id;
	}
};

module.exports.deleteSpecialties = async function()
{
	for (let i = 0; i < test_config.specialties.length; i++) {
		const specialtyId = test_config.specialties[i].id;
		const specialtyDeleted = await specialtyManagement.deleteSpecialty(specialtyId);

		if (!specialtyDeleted.success)
			await onErrorFullDelete(specialtyDeleted.message, specialtyDeleted.data);

		test_config.specialties[i].id = "";
	}
};