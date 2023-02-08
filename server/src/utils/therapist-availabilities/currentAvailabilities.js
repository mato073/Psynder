const db = require("../../db.js");

module.exports.getDefinedDays = function(availabilities)
{
	let res = [];

	for (let i = 0; i < availabilities.length; i++)
		res.push(availabilities[i].day);

	return res;
};

module.exports.getDayName = function(utcDay)
{
	const utcDaysFormat = [{id: 0, name: "sunday"}, {id: 1, name: "monday"}, {id: 2, name: "tuesday"}, {id: 3, name: "wednesday"}, {id: 4, name: "thursday"}, {id: 5, name: "friday"}, {id: 6, name: "saturday"}];

	for (let i = 0; i < utcDaysFormat.length; i++)
		if (utcDay === utcDaysFormat[i].id)
			return (utcDaysFormat[i].name);
};

module.exports.getAppointmentsForDay = function(date, appointments)
{
	const res = [];

	for (let i = 0; i < appointments.length; i++)
		if (new Date(appointments[i].date).toISOString().startsWith(date))
			res.push(appointments[i]);

	return res;
};

module.exports.getCurrentAvailabilitiesForDay = async function(dayAvailabilities, dayAppointments)
{
	if (dayAvailabilities.length < 1)
		return [];

	const dayTimeSlotsFromAppointments = [];
	for (let i = 0; i < dayAppointments.length; i++) {
		const fullTypeOfAppointment = await db.get().collection("AppointmentTypes").findOne({"_id": dayAppointments[i].type});
		if (!fullTypeOfAppointment)
			return ({success: false, message: "Error when fetching therapist appointment types"});
		dayAppointments[i].type = fullTypeOfAppointment;
		dayTimeSlotsFromAppointments.push(module.exports.getTimeSlotFromAppointment(dayAppointments[i]));
	}

	if (dayTimeSlotsFromAppointments.length < 1)
		return dayAvailabilities;
	
	const currentAvailabilitiesArr = [];

	for (let i = 0; i < dayAvailabilities.length; i++) {
		const appointmentsInTimeSlot = module.exports.getAllAppointmentsInATimeSlot(dayAvailabilities[i], dayTimeSlotsFromAppointments);

		let currentAvailability = {from: dayAvailabilities[i].from, to: ""};
		for (let j = 0; j < appointmentsInTimeSlot.length; j++) {
			if (appointmentsInTimeSlot[j].from === currentAvailability.from) {
				currentAvailability.from = appointmentsInTimeSlot[j].to;

			} else if (Date.parse(`01/01/2000 ${appointmentsInTimeSlot[j].from}`) > Date.parse(`01/01/2000 ${currentAvailability.from}`)) {
				currentAvailability.to = appointmentsInTimeSlot[j].from;
				currentAvailabilitiesArr.push({from: currentAvailability.from, to: currentAvailability.to});
				currentAvailability.from = appointmentsInTimeSlot[j].to;
				currentAvailability.to = "";
			}
		}

		if (currentAvailability.to === "")
			currentAvailability.to = dayAvailabilities[i].to;

		currentAvailabilitiesArr.push({from: currentAvailability.from, to: currentAvailability.to});
	}

	return currentAvailabilitiesArr;
};

module.exports.getAllAppointmentsInATimeSlot = function(timeSlot, appointments)
{
	const res = [];

	for (let i = 0; i < appointments.length; i++)
		if ((Date.parse(`01/01/2000 ${appointments[i].from}`) >= Date.parse(`01/01/2000 ${timeSlot.from}`) && Date.parse(`01/01/2000 ${appointments[i].to}`) <= Date.parse(`01/01/2000 ${timeSlot.to}`)))
			res.push(appointments[i]);

	return res;
};

module.exports.getTimeSlotFromAppointment = function(appointment)
{
	let timeSlot = {from: "", to: ""};
	const date = new Date(appointment.date);
	let minutes = date.getMinutes();

	timeSlot.from = `${date.getHours()}:${(minutes < 10 ? `0${minutes}` : minutes)}`;
	date.setMinutes(date.getMinutes() + fromCutomDurationGetTotalMinutes(appointment.type.duration));
	minutes = date.getMinutes();
	timeSlot.to = `${date.getHours()}:${(minutes < 10 ? `0${minutes}` : minutes)}`;

	return timeSlot;
};

function fromCutomDurationGetTotalMinutes(customDuration)
{
	const splitTime = customDuration.split(':');

	return (parseInt(splitTime[0]) * 60 + parseInt(splitTime[1]));
}