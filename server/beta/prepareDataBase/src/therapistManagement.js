const sendRequest = require("./sendRequest.js");

module.exports.createTherapist = async function(email, password, firstName, lastName, phoneNumber)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/signup",
			headers: {
				"Content-Type": "application/json"
			},
			data : JSON.stringify({"password": password, "email": email, "firstName": firstName, "lastName": lastName, "phoneNumber": phoneNumber})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.connectTherapist = async function(email, password)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/login",
			headers: {
				"Content-Type": "application/json"
			},
			data : JSON.stringify({"password": password, "email": email})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, therapist: res.body});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.deleteTherapist = async function(accessToken)
{
	try {
		const reqConfig = {
			method: "delete",
			url: "http://localhost:8080/therapists/current",
			headers: {
				"Authorization": `Bearer ${accessToken}`
			}
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.addSpecialtyToTherapist = async function(accessToken, spcialtyId)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/current/specialties",
			headers: {
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			data: JSON.stringify({"specialty": spcialtyId})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.addAlreadyTreatedDisorderToTherapist = async function(accessToken, disorderAlreadyTreated)
{
	try {
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/current/disorderAlreadyTreated",
			headers: {
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			data: JSON.stringify({"alreadyTreated": disorderAlreadyTreated})
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

function _randomPos(center, radius) {
	const y0 = center.latitude;
	const x0 = center.longitude;
	const rd = radius / 111300; //about 111300 meters in one degree

	const u = Math.random();
	const v = Math.random();

	const w = rd * Math.sqrt(u);
	const t = 2 * Math.PI * v;
	const x = w * Math.cos(t);
	const y = w * Math.sin(t);

	//Adjust the x-coordinate for the shrinking of the east-west distances
	const xp = x / Math.cos(y0);

	const newlat = y + y0;
	const newlon = x + x0;
	const newlon2 = xp + x0;

	return {
		'latitude': newlat.toFixed(5),
		'longitude': newlon.toFixed(5),
		'longitude2': newlon2.toFixed(5),
	};
}

module.exports.addRandLocationToTherapist = async function(accessToken, center) {
	try {
		const newPos = _randomPos(center, 30000);
		const reqConfig = {
			method: "post",
			url: "http://localhost:8080/therapists/current/location",
			headers: {
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				"lat": newPos.latitude,
				"lng": newPos.longitude
			})
		};
		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};

module.exports.getCurrentTherapist = async function(accessToken)
{
	try {
		const reqConfig = {
			method: "get",
			url: "http://localhost:8080/therapists/current",
			headers: {
				"Authorization": `Bearer ${accessToken}`
			}
		};

		const res = await sendRequest(reqConfig);
		if (res.error || res.status !== 200)
			return ({success: false, message: res.message, data: res.data});
		return ({success: true, therapist: res.body});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};


function _createNewDuration() {
	const rand = Math.random() * 160;
	const res = Math.ceil(rand / 15) * 15;
	return res;
}

let dateCursor;

function _initDate() {
	dateCursor = new Date();
	dateCursor.setDate(dateCursor.getDate() - 7);
	dateCursor.setHours(9);
	dateCursor.setMinutes(0);
}

function _createNewDate() {
	while (dateCursor.getDay() === 0 || dateCursor.getDay() === 6)
		dateCursor.setDate(dateCursor.getDate() + 1);
	let res = new Date(dateCursor);
	res.setHours(9 + (Math.ceil(Math.random() * 10 % 8)));
	res.setMinutes((Math.ceil(Math.random() * 100 % 60 / 60) * 60));
	dateCursor.setDate(dateCursor.getDate() + 1);
	return res;
}


module.exports.populateTherapistAppointments = async function(accessToken, id) {
	try {
		_initDate();
		for (let user of data_config.users) {
			const date = _createNewDate();
			const duration = _createNewDuration();
			const config =  {
				method: "post",
				url: "http://localhost:8080/appointments/",
				headers: {
					"Authorization": `Bearer ${accessToken}`,
					"Content-Type": "application/json"
				},
				data: JSON.stringify({
					"date": date.toISOString(),
					"user": user.uid,
					"therapist": id,
					"duration": duration
				})
			};
			const res = await sendRequest(config);
			if (res.error || res.status !== 200)
				return ({success: false, message: res.message, data: res.data});
		}
		return ({success: true});
	} catch (exception) {
		return ({success: false, message: exception.stack});
	}
};