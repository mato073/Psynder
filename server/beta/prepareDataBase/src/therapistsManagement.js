const therapistManagement = require("./therapistManagement.js");
const onErrorFullDelete = require("./onErrorFullDelete.js");
const util = require("util");
const fs = require('fs');
const { parse } = require('fast-csv');
const path = require('path');

module.exports.createTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];
		const therapistCreated = await therapistManagement.createTherapist(therapist.email, therapist.password, therapist.firstName, therapist.lastName, therapist.phoneNumber);

		if (!therapistCreated.success)
			await onErrorFullDelete(therapistCreated.message, therapistCreated.data);
	}
};

module.exports.connectTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];
		const therapistLogged = await therapistManagement.connectTherapist(therapist.email, therapist.password);

		if (!therapistLogged.success)
			await onErrorFullDelete(therapistLogged.message, therapistLogged.data);

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

module.exports.addSpecialtiesToTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];

		for (let j = 0; j < therapist.specialties.length; j++) {
			const specialty = data_config.specialties.find(sp => sp.name === therapist.specialties[j]);
			const therapistDeleted = await therapistManagement.addSpecialtyToTherapist(therapist.accessToken, specialty.id);

			if (!therapistDeleted.success)
				await onErrorFullDelete(therapistDeleted.message, therapistDeleted.data);
		}
	}
};

module.exports.addAlreadyTreatedDisordersToTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];

		for (let j = 0; j < therapist.alreadyTreated.length; j++) {
			const therapistDeleted = await therapistManagement.addAlreadyTreatedDisorderToTherapist(therapist.accessToken, therapist.alreadyTreated[j]);

			if (!therapistDeleted.success)
				await onErrorFullDelete(therapistDeleted.message, therapistDeleted.data);
		}
	}
};

async function _addTherapistsToLocation(lat, lng, start, end) {
	if (typeof(lat) !== "number" || typeof(lng) !== "number")
		throw Error('_addTherapistsToLocation: wrong type provided for lat and / or lng');
	for (let i = start; i < data_config.therapists.length && i < end; i++) {
		const therapist = data_config.therapists[i];
		const center = {
			latitude: lat,
			longitude: lng
		};
		const locationAdded = await therapistManagement.addRandLocationToTherapist(therapist.accessToken, center);
		if (!locationAdded.success) {
			await onErrorFullDelete(locationAdded.message, locationAdded.data);
		}
	}
}

module.exports.addLocationsToTherapists = async function() {
	/* 
	** Here specify at which row of assets/france_cities.csv you wish to stop
	** (all the cities above it will be populated)
	 */
	const stopAtRow = 20;

	const data = fs.readFileSync(path.join(__dirname, '..', 'assets', 'france_cities.csv')).toString();
	let therapistNbrForEachLocation = Math.floor(data_config.therapists.length / stopAtRow);
	let rowIndex;
	const stream = parse({headers: true, maxRows: stopAtRow})
		.on('error', err => {
			throw Error(err)
		})
		.on('data', async row => {
			rowIndex = (typeof(rowIndex) === "number") ? rowIndex + 1 : 0;
			await _addTherapistsToLocation(parseFloat(row.lat), parseFloat(row.lng), rowIndex * 2, rowIndex * 2 + therapistNbrForEachLocation);	
		})
		.on('end', rowCount => {
			console.log(`Added locations to therapists`);
		});
	await stream.write(data);
	await stream.end();
};

module.exports.addAppointmentsToTherapists = async function() {
	for (let therapist of data_config.therapists) {
		const aptAdd = await therapistManagement.populateTherapistAppointments(therapist.accessToken, therapist.uid);
		if (!aptAdd.success)
			await onErrorFullDelete(aptAdd.message, aptAdd.data);
	}
};

module.exports.getCurrentTherapists = async function()
{
	for (let i = 0; i < data_config.therapists.length; i++) {
		const therapist = data_config.therapists[i];
		const therapistGet = await therapistManagement.getCurrentTherapist(therapist.accessToken);

		if (!therapistGet.success)
			await onErrorFullDelete(therapistGet.message, therapistGet.data);

		console.log(util.inspect(therapistGet.therapist, false, null, true /* enable colors */));
	}
};