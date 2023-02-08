
const TimeSlot = function(_from, _to, _type, _color) {
	return ({from: _from, to: _to, type: (_type !== undefined ? _type : "AnyAppointements"), color: (_color !== undefined ?_color : "")});
};

const Day = function(dayName, _timeSlots) {
	return ({day: dayName, timeSlots: _timeSlots});
};

module.exports = function(json)
{
	const days = [];

	for (let i = 0; i < json.days.length; i++) {
		const day = json.days[i];
		const timeSlots = [];
		for (let j = 0; j < day.timeSlots.length; j++) {
			const timeSlot = day.timeSlots[j];
			timeSlots.push(new TimeSlot(timeSlot.from, timeSlot.to, timeSlot.type, timeSlot.color));
		}

		days.push(new Day(day.day.toLowerCase(), timeSlots));
	}

	return (days);
};