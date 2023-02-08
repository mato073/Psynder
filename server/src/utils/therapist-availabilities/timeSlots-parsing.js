module.exports = function(dayName, timeSlots)
{
	for (let j = 0; j < timeSlots.length; j++) {
		if (!timeSlots[j].from|| !timeSlots[j].to)
			return ({success: false, message: `Informations are missing in day '${dayName}'`});
		if (typeof(timeSlots[j].from) !== "string" || typeof(timeSlots[j].to) !== "string")
			return ({success: false, message: `Bad type informations in day '${dayName}'`});

		const checkTimeFormatResults = checkTimeFormat(dayName, timeSlots[j]);
		if (!checkTimeFormatResults.success)
			return ({success: false, message: checkTimeFormatResults.message});

		const checkTypeOfTimeSlotResults = checkTypeOfTimeSlot(dayName, timeSlots[j]);
		if (!checkTypeOfTimeSlotResults.success)
			return ({success: false, message: checkTypeOfTimeSlotResults.message});
	}

	const checkDuplicateTimesResults = checkDuplicateTimes(dayName, timeSlots);
	if (!checkDuplicateTimesResults.success)
		return ({success: false, message: checkDuplicateTimesResults.message});

	const checkOverlappingTimesResults = checkOverlappingTimes(dayName, timeSlots);
	if (!checkOverlappingTimesResults.success)
		return ({success: false, message: checkOverlappingTimesResults.message});


	return ({success: true});
};

function checkTimeFormat(dayName, timeSlot)
{
	const timeCheckRegEx = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
	if (!timeCheckRegEx.test(timeSlot.from))
		return ({success: false, message: `Bad format information in day '${dayName}', in time slot variable 'from' ${timeSlot.from}`});

	if (!timeCheckRegEx.test(timeSlot.to))
		return ({success: false, message: `Bad format information in day '${dayName}', in time slot variable 'to' ${timeSlot.to}`});

	if (Date.parse(`01/01/2000 ${timeSlot.from}`) >= Date.parse(`01/01/2000 ${timeSlot.to}`))
		return ({success: false, message: `Bad ordering information in day '${dayName}', in time slot {"from": ${timeSlot.from}, "to": ${timeSlot.to}, "type": ${timeSlot.type}}`});

	return ({success: true});
}

function checkTypeOfTimeSlot(dayName, timeSlot)
{
	const validTypes = ["FirstAppointments", "GroupAppointments", "AnyAppointments"];

	if (timeSlot.type && !validTypes.includes(timeSlot.type))
		return ({success: false, message: `'${timeSlot.type}' isn't a valid type in day '${dayName}', in time slot {"from": ${timeSlot.from}, "to": ${timeSlot.to}, "type": ${timeSlot.type}}`});

	return ({success: true});
}

function checkDuplicateTimes(dayName, timeSlots)
{
	for (let j = 0; j < timeSlots.length; j++) {
		for (let k = 0; k < timeSlots.length; k++) {
			if (k === j)
				continue;
			if (timeSlots[k].from === timeSlots[j].from || timeSlots[k].from === timeSlots[j].from)
				return ({success: false, message: `In day '${dayName}', time slot {"from": ${timeSlots[j].from}, "to": ${timeSlots[j].to}, "type": ${timeSlots[j].type}} is incompatible with {"from": ${timeSlots[k].from}, "to": ${timeSlots[k].to}, "type": ${timeSlots[k].type}}`});
		}
	}

	return ({success: true});
}


function checkOverlappingTimes(dayName, timeSlots)
{
	for (let j = 0; j < timeSlots.length; j++) {

		for (let k = 0; k < timeSlots.length; k++) {
			if (k === j)
				continue;

			if ((Date.parse(`01/01/2000 ${timeSlots[k].from}`) > Date.parse(`01/01/2000 ${timeSlots[j].from}`) && Date.parse(`01/01/2000 ${timeSlots[k].from}`) < Date.parse(`01/01/2000 ${timeSlots[j].to}`)) || (Date.parse(`01/01/2000 ${timeSlots[k].to}`) > Date.parse(`01/01/2000 ${timeSlots[j].from}`) && Date.parse(`01/01/2000 ${timeSlots[k].to}`) < Date.parse(`01/01/2000 ${timeSlots[j].to}`)))
				return ({success: false, message: `In day '${dayName}', time slot {"from": ${timeSlots[j].from}, "to": ${timeSlots[j].to}, "type": ${timeSlots[j].type}} is incompatible with {"from": ${timeSlots[k].from}, "to": ${timeSlots[k].to}, "type": ${timeSlots[k].type}}`});
		}
	}
	return ({success: true});
}
